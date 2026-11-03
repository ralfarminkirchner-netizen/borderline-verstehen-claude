// Schreibschutz für alle lokalen Schreibvorgänge dieser Fassung.
// Vor jeder ersten Schreiboperation wird geprüft, ob das registrierte externe
// Volume tatsächlich eingehängt ist und das Ziel auf genau diesem Dateisystem liegt.
// Kein Ersatzpfad: fehlt das Volume, hält die Anwendung an.
import { existsSync, realpathSync, statSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

export const REGISTERED_VOLUME = '/Volumes/ThunderBolt4_2TB';
export const REGISTERED_UUID = 'A03B10FD-5F22-4366-A71C-2D95AC701BD2';

export class ExternalStorageError extends Error {}

export function checkVolume() {
  if (process.platform !== 'darwin') throw new ExternalStorageError('Diese lokale Fassung benötigt das registrierte externe Mac-Volume.');
  let info;
  try { info = execFileSync('/usr/sbin/diskutil', ['info', '-plist', REGISTERED_VOLUME], { encoding: 'utf8', timeout: 5000 }); }
  catch { throw new ExternalStorageError('Externes Arbeitsvolume fehlt. Vor dem Schreiben angehalten.'); }
  const uuid = info.match(/<key>VolumeUUID<\/key>\s*<string>([^<]+)<\/string>/)?.[1];
  const mountPoint = info.match(/<key>MountPoint<\/key>\s*<string>([^<]+)<\/string>/)?.[1];
  if (uuid !== REGISTERED_UUID || mountPoint !== REGISTERED_VOLUME) throw new ExternalStorageError('Das Arbeitsvolume ist nicht das registrierte, eingehängte Volume.');
  return { uuid, mountPoint };
}

// Liefert den aufgelösten, geprüften Zielpfad oder wirft.
export function requireExternalWriteTarget(target) {
  checkVolume();
  return pruefeZiel(target);
}

// Pfad- und Dateisystemprüfung ohne erneuten diskutil-Aufruf; nur nach checkVolume() im selben Vorgang verwenden.
export function pruefeZiel(target) {
  const volume = realpathSync(REGISTERED_VOLUME);
  const requested = resolve(target);
  let probe = requested;
  while (!existsSync(probe)) probe = dirname(probe);
  const realProbe = realpathSync(probe);
  const actual = requested === probe ? realProbe : resolve(realProbe, requested.slice(probe.length + 1));
  if (!actual.startsWith(volume + sep)) throw new ExternalStorageError('Schreibziel liegt nicht auf dem geprüften externen Volume.');
  if (statSync(realProbe).dev !== statSync(volume).dev) throw new ExternalStorageError('Schreibziel liegt auf einem anderen Dateisystem.');
  return actual;
}

// Direkter Aufruf: `node scripts/external-storage.mjs <pfad>` prüft und meldet.
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const target = requireExternalWriteTarget(process.argv[2] || process.cwd());
    console.log(`geprüft: ${target}`);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }
}
