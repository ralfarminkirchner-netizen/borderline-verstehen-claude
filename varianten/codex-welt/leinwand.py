#!/usr/bin/env python3
"""Statische, datengetragene Entwurfszeichnungen. Kein Anwendungscode.

Alle Schreibziele werden am registrierten externen Volume geprüft.
SVGs werden anschließend mit Chrome gerastert, nicht als Funktionsnachweis.
"""
from pathlib import Path
import html
import json
import math
import subprocess

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
subprocess.run(['node', str(ROOT/'scripts/external-storage.mjs'), str(HERE)], check=True)
OUT = HERE/'bilder'
OUT.mkdir(exist_ok=True)
K = json.loads((ROOT/'data-readonly/karte.json').read_text())
P, F, R = K['orte'], K['fugen'], K['regionen']
INK, MUTE, BG = '#173E4B', '#526F79', '#EDF3F6'
COLORS = ['#9D8146','#368C7B','#637DAD','#538D9C','#92815B',
          '#7C789F','#B45D7B','#7770A5','#BA8653','#678C94']
NEIGHBORS = {i:[] for i in range(len(P))}
for f in F:
    NEIGHBORS[f['a']].append(f['b'])
    NEIGHBORS[f['b']].append(f['a'])

def oklab_mix(left, right, t):
    """sRGB → linear sRGB → OKLab → mix → linear sRGB → sRGB.

    The SVG receives sampled stops because SVG otherwise interpolates in RGB.
    Clipping only guards the destination gamut; these pigments are in gamut.
    """
    def lab(hexcolor):
        rgb=[int(hexcolor[j:j+2],16)/255 for j in (1,3,5)]
        r,g,b=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
        l=(.4122214708*r+.5363325363*g+.0514459929*b)**(1/3)
        m=(.2119034982*r+.6806995451*g+.1073969566*b)**(1/3)
        s=(.0883024619*r+.2817188376*g+.6299787005*b)**(1/3)
        return (.2104542553*l+.7936177850*m-.0040720468*s,
                1.9779984951*l-2.4285922050*m+.4505937099*s,
                .0259040371*l+.7827717662*m-.8086757660*s)
    L,a,b=[u*(1-t)+v*t for u,v in zip(lab(left),lab(right))]
    l=(L+.3963377774*a+.2158037573*b)**3
    m=(L-.1055613458*a-.0638541728*b)**3
    s=(L-.0894841775*a-1.2914855480*b)**3
    rgb=(4.0767416621*l-3.3077115913*m+.2309699292*s,
         -1.2684380046*l+2.6097574011*m-.3413193965*s,
         -.0041960863*l-.7034186147*m+1.7076147010*s)
    def encode(v):
        v=max(0,min(1,v))
        return round(255*(12.92*v if v<=.0031308 else 1.055*v**(1/2.4)-.055))
    return '#'+''.join(f'{encode(v):02X}' for v in rgb)

LEFT, RIGHT = COLORS[6], '#C58A7A'
MIX = oklab_mix(LEFT,RIGHT,.5)
LABELS = {c:oklab_mix(c,INK,.26) for c in COLORS}
PIGMENTS = {i:oklab_mix(COLORS[p['r']], '#FFFFFF', ((i*37)%19)/120) for i,p in enumerate(P)}
PIGMENTS[1031], PIGMENTS[1034] = LEFT, RIGHT

def fmt(n): return f'{n:.2f}'
def esc(s): return html.escape(str(s),quote=True)
def txt(x,y,lines,size=20,color=INK,role='sans',weight=400,anchor='start',spacing=None):
    color=LABELS.get(color,color)  # Same pigment family, sufficient text contrast.
    if isinstance(lines,str): lines=lines.split('\n')
    style = f'font-size:{size}px;fill:{color};font-weight:{weight};text-anchor:{anchor}'
    if spacing is not None: style += f';letter-spacing:{spacing}px'
    return f'<text class="{role}" x="{x}" y="{y}" style="{style}">' + ''.join(
        f'<tspan x="{x}" dy="{0 if j==0 else size*1.22}">{esc(s)}</tspan>' for j,s in enumerate(lines))+'</text>'

def blob(x,y,rx,ry,phase=0,rough=.07,n=72):
    pts=[]
    for i in range(n):
        a=math.tau*i/n
        r=1+rough*(.6*math.sin(a*3+phase)+.3*math.cos(a*5-phase)+.2*math.sin(a*7+phase*.6))
        pts.append((x+math.cos(a)*rx*r,y+math.sin(a)*ry*r))
    return 'M'+' L'.join(f'{a:.2f},{b:.2f}' for a,b in pts)+' Z'

def region(x,y,rx,ry,c,phase=0):
    s=f'<path d="{blob(x,y,rx,ry,phase,.11)}" fill="{c}" opacity=".065"/>'
    for j in range(5):
        s+=f'<path d="{blob(x,y,rx*(1-j*.028),ry*(1-j*.028),phase+j*.06,.11)}" fill="none" stroke="{c}" stroke-width="{.7 if j else 1.2}" opacity="{.22-j*.027}"/>'
    return s

def line(x1,y1,x2,y2,c,width=1,opacity=.4,bend=.1,dash=None):
    dx,dy=x2-x1,y2-y1
    q=f'M{x1},{y1} C{x1+dx*.4-dy*bend},{y1+dy*.4+dx*bend} {x1+dx*.6-dy*bend},{y1+dy*.6+dx*bend} {x2},{y2}'
    return f'<path d="{q}" fill="none" stroke="{c}" stroke-width="{width}" opacity="{opacity}" stroke-linecap="round"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'

def organism(x,y,r,c,index,arms=True,quiet=False):
    s=''
    if index>=0: c=PIGMENTS[index]
    phase=(index*.618)%math.tau
    if arms:
        # Anzahl echter Anschlüsse; die Richtung ist auf der Nahzeichnung komponiert.
        for j in range(min(NEIGHBORS.get(index,[]).__len__(),8)):
            a=phase+j*math.tau/max(1,min(len(NEIGHBORS[index]),8))
            x1,y1=x+math.cos(a)*r*.8,y+math.sin(a)*r*.8
            x2,y2=x+math.cos(a)*r*1.68,y+math.sin(a)*r*1.68
            s+=line(x1,y1,x2,y2,c,max(.6,r*.035),.32,.14)
            s+=f'<circle cx="{x2}" cy="{y2}" r="{max(.5,r*.035)}" fill="{c}" opacity=".6"/>'
    s+=f'<path d="{blob(x,y,r,r*.83,phase,.17)}" fill="{c}" opacity="{.22 if quiet else .34}"/>'
    s+=f'<path d="{blob(x,y,r*.91,r*.76,phase,.17)}" fill="none" stroke="{c}" stroke-width="{max(.65,r*.018)}" opacity=".8"/>'
    if r>9:
        for j in range(3):
            s+=f'<path d="{blob(x-r*.08,y+r*.025,r*(.72-j*.16),r*(.6-j*.14),phase+j*.2,.1)}" fill="none" stroke="{c}" opacity="{.2+j*.12}" stroke-width=".8"/>'
        s+=f'<ellipse cx="{x-r*.14}" cy="{y-r*.05}" rx="{r*.19}" ry="{r*.145}" fill="{c}" opacity=".7"/>'
        s+=f'<ellipse cx="{x-r*.19}" cy="{y-r*.08}" rx="{r*.06}" ry="{r*.04}" fill="#fff" opacity=".8"/>'
    return s

def defs():
    stops=''.join(f'<stop offset="{j/8}" stop-color="{oklab_mix(LEFT,RIGHT,j/8)}" stop-opacity="{.38+.19*math.sin(math.pi*j/8)}"/>' for j in range(9))
    return '''<defs>
      <radialGradient id="water"><stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4EEF1"/></radialGradient>
      <radialGradient id="wash"><stop stop-color="#9ACABF" stop-opacity=".11"/><stop offset="1" stop-color="#9ACABF" stop-opacity="0"/></radialGradient>
      <linearGradient id="contact">'''+stops+'''</linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
      <style>.serif{font-family:Baskerville,'Iowan Old Style',Georgia,serif}.sans{font-family:'Avenir Next',Avenir,Arial,sans-serif}text{font-kerning:normal}</style>
    </defs>'''

def begin(w=1800,h=1160):
    s=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'+defs()
    s+=f'<path d="M0 0H{w}V{h}H0Z" fill="url(#water)"/>'
    s+=f'<ellipse cx="{w*.56}" cy="{h*.53}" rx="{w*.6}" ry="{h*.5}" fill="url(#wash)"/>'
    for j in range(13):
        y=230+j*88
        s+=f'<path d="M-140,{y} C380,{y-225} 990,{y+185} {w+120},{y-165}" stroke="#A1BDC6" stroke-opacity=".09" stroke-width=".8" fill="none"/>'
    return s

def mast(sublabel='Lebende Welt',w=1800):
    s=txt(62,52,'BORDERLINE VERSTEHEN',14,INK,weight=600,spacing=2.1)
    s+=txt(62,79,sublabel,17,MUTE)
    if w>800:
        s+=txt(w-440,60,'Zugang',16,MUTE)+txt(w-322,60,'Ruhe',16,INK)+txt(w-220,60,'Orte finden',16,MUTE)
        s+='<path d="M1440 49v13m7-13v13" stroke="#173E4B" stroke-width="1.6"/>' if w==1800 else ''
    return s

def footer(label,w=1800,h=1160):
    return txt(62,h-39,label,14,MUTE)+txt(w-62,h-39,'codex',15,MUTE,anchor='end')

def save(name,s):
    (OUT/f'{name}.svg').write_text(s+'</svg>')

def world():
    s=begin()+mast()
    s+=txt(62,194,'Lebende\nWelt',90,INK,'serif')
    s+=txt(66,447,'Nähe kann tragen.\nAbstand kann schützen.',29,INK,'serif')
    s+=txt(67,540,'Die Angst vor Verlust\nist groß',26,COLORS[6],weight=500)
    s+=txt(67,628,['Die Angst ist als Erleben','ernst zu nehmen. Sie beweist','nicht, dass eine Trennung','bevorsteht.'],20,MUTE)
    s+=txt(67,774,'Zu diesem Ort',17,COLORS[6],weight=600)
    s+=line(228,767,340,767,COLORS[6],1,.7,0)
    s+='<path d="M333 762l7 5-7 5" fill="none" stroke="#B45D7B"/>'
    sx,sy=.35,.265
    pos=lambda p:(1030+p['x']*sx,594+p['y']*sy)
    for j,r in enumerate(R):
        x,y=pos(r)
        s+=region(x,y,r['r']*sx,r['r']*sy,COLORS[j],j)
    # Zurückhaltende echte gebietsübergreifende Anschlüsse, keine Distanzkanten.
    shown=0
    for f in F:
        if P[f['a']]['r']!=P[f['b']]['r'] and (f['a']+f['b'])%5==0:
            x1,y1=pos(P[f['a']]);x2,y2=pos(P[f['b']])
            s+=line(x1,y1,x2,y2,COLORS[P[f['a']]['r']],.8,.11,.12)
            shown+=1
    for i,p in enumerate(P):
        x,y=pos(p);r=1.8+min(2.8,math.log2(p['n']+1)*.55)
        s+=organism(x,y,r,COLORS[p['r']],i,arms=True,quiet=i!=1031)
    x,y=pos(P[1031]);s+=organism(x,y,18,COLORS[6],1031)
    s+=f'<circle cx="{x}" cy="{y}" r="29" stroke="{COLORS[6]}" fill="none" stroke-width=".8" stroke-dasharray="1 5"/>'
    # Labels are detached just enough to keep every dense organism field legible.
    labels=[(0,1458,371,['TraumaAtlas']), (1,1382,1030,['Phänomenatlas']),
      (2,770,1033,['Neuroatlas']), (3,535,646,['Dynamikraum']),
      (4,742,794,['Beziehungswerkstatt']), (5,769,440,['ADHS ·','Randphänomene']),
      (6,1012,421,['Beziehungen &','Borderline']),
      (7,920,164,['Diagnose &','Differenzierung']), (8,1213,403,['Trigger & Kontext']),
      (9,1124,768,['Forschung &','Einordnung'])]
    for j,lx,ly,ls in labels:
        c=COLORS[j];s+=txt(lx,ly,ls,23 if j==6 else 21,c,'serif',anchor='middle')
        s+=txt(lx,ly+len(ls)*27,f"{R[j]['count']} Orte",13,MUTE,anchor='middle')
    s+=footer('1 226 Orte  ·  10 Gebiete')
    save('01-weltkarte',s)

def neighborhood():
    s=begin()+mast('Lebende Welt  /  Beziehungen & Borderline')
    s+=region(786,621,620,408,COLORS[6],1)
    s+=region(1405,334,330,260,COLORS[7],3)
    s+=region(1470,925,380,280,COLORS[4],5)
    s+=txt(62,185,'Beziehungen &\nBorderline',64,INK,'serif')
    s+=txt(66,364,'Erleben anerkennen,\nohne alles zu bestätigen.',25,MUTE,'serif')
    s+=txt(1447,179,['Diagnose &','Differenzierung'],27,COLORS[7],'serif',anchor='middle')
    s+=txt(1484,976,'Beziehungswerkstatt',28,COLORS[4],'serif',anchor='middle')
    loc={1031:(790,570),1030:(555,377),1032:(405,760),1034:(1070,837),1053:(1330,335),
         1025:(748,320),1026:(886,365),1027:(1004,420),1028:(1116,510),1029:(1087,635),
         1033:(795,914),1035:(583,891),1036:(480,521),1037:(497,650),1038:(715,760),
         1039:(855,716),1040:(915,868),1041:(1245,725),1042:(1238,588),1043:(970,572),
         1044:(635,662),1045:(618,533),1046:(1187,903),1047:(974,983),1048:(360,922),
         1049:(656,1012),1050:(1350,807),1051:(294,568),1052:(1121,1035)}
    for f in F:
        a,b=f['a'],f['b']
        if a in loc and b in loc:
            x1,y1=loc[a];x2,y2=loc[b]
            s+=line(x1,y1,x2,y2,COLORS[P[a]['r']],1.2 if 1031 in [a,b] else .7,.52 if 1031 in [a,b] else .1,.11)
    for i,(x,y) in loc.items():
        s+=organism(x,y,51 if i==1031 else 30 if i in [1030,1032,1034,1053] else 13+P[i]['n'],COLORS[P[i]['r']],i)
    s+=txt(786,487,['Die Angst vor','Verlust ist groß'],29,INK,'serif',anchor='middle')
    s+=txt(510,304,['Eine Antwort','bleibt aus'],23,INK,'serif',anchor='middle')
    s+=txt(337,827,['Wenn Nähe zur','Verpflichtung wird'],24,INK,'serif',anchor='middle')
    s+=txt(1050,948,'Auch meine Grenze gilt',25,INK,'serif',anchor='middle')
    s+=txt(1326,403,['Verlassenheitsangst und','Vermeidungsbemühungen'],25,COLORS[7],'serif',anchor='middle')
    s+=txt(1047,218,'Symptomdomäne und Alltagsszene',15,COLORS[7],anchor='middle')
    s+=txt(1037,240,'unterscheiden',15,COLORS[7],anchor='middle')
    s+=txt(790,969,'Abstand wünschen',17,MUTE,anchor='middle')
    s+=txt(1159,474,['Rückzug hat mehrere','mögliche Bedeutungen'],16,MUTE)
    s+=txt(340,982,['Eine Pause bekommt','eine tragbare Form'],17,MUTE,anchor='middle')
    s+=txt(1307,622,['Die andere Innenwelt','bleibt eine Hypothese'],17,MUTE)
    s+=txt(1600,555,'Einordnung',15,COLORS[7],anchor='middle')
    s+=txt(1600,584,['Eine Episode belegt','keinen Bindungstyp','und keine Diagnose.'],19,INK,'serif',anchor='middle')
    s+=footer('28 Orte  ·  vier Verbindungen am gewählten Ort')
    save('02-beziehungsgebiet',s)

def encounter():
    s=begin()+mast('Beziehungen & Borderline  /  Die Angst vor Verlust ist groß')
    s+=region(1190,611,560,402,COLORS[6],2)
    s+=txt(66,204,'Die Angst vor\nVerlust ist groß',72,INK,'serif')
    s+=txt(70,416,'Beim Abschied sagt Pat:',19,MUTE)
    s+=txt(70,466,['„Wenn du gehst, bin ich','dir wohl nicht wichtig.“'],34,INK,'serif')
    s+=txt(70,583,['Dabei ist nur ein Abend','allein geplant.'],23,INK)
    s+=txt(70,710,['Die Angst ist als Erleben ernst zu nehmen.','Sie beweist nicht, dass eine Trennung','bevorsteht, und verpflichtet das Gegenüber','nicht zu unbegrenzter Rückversicherung.'],20,MUTE)
    s+=txt(70,918,'Beobachtung   ·   Deutung   ·   Handlungsspielraum',16,COLORS[6])
    s+=txt(70,976,'Herkunft: Beziehungskarte',16,MUTE)
    # Two actual editorially connected phenomena. Contact colour uses OKLab.
    s+=line(1046,531,1370,690,'url(#contact)',18,.85,.07)
    s+=line(1046,531,1370,690,MIX,2,.6,.07)
    s+=organism(1046,531,139,COLORS[6],1031)
    s+=organism(1370,690,117,RIGHT,1034)
    # The chromatic thread is behind the two independent bodies.
    s+=txt(1044,349,['Die Angst vor','Verlust ist groß'],28,INK,'serif',anchor='middle')
    s+=txt(1422,855,['Auch meine','Grenze gilt'],32,INK,'serif',anchor='middle')
    s+=txt(1327,443,['Bedürfnis trifft','begrenzte Verfügbarkeit'],20,INK,anchor='middle')
    s+=txt(1327,385,'EINORDNUNG',12,COLORS[6],weight=600,anchor='middle',spacing=2)
    s+=txt(939,932,['Anteilnahme und begrenzte Verfügbarkeit','können zusammengehören.'],23,INK,'serif')
    # Three other true neighbours, not more invented connections.
    for i,x,y,r in [(1030,844,243,24),(1032,865,795,29),(1053,1572,233,28)]:
        s+=line(1046,531,x,y,COLORS[P[i]['r']],1,.28,.06)
        s+=organism(x,y,r,COLORS[P[i]['r']],i)
    s+=txt(845,178,'Eine Antwort bleibt aus',16,MUTE,anchor='middle')
    s+=txt(738,856,['Wenn Nähe zur','Verpflichtung wird'],17,MUTE,anchor='middle')
    s+=txt(1570,154,['Verlassenheitsangst und','Vermeidungsbemühungen'],17,COLORS[7],anchor='middle')
    s+=footer('Beziehungskarte  ·  „Auch meine Grenze gilt“  ·  Zur Herkunft')
    save('03-begegnung',s)

def media():
    s=begin()+mast('Lebende Welt  /  TraumaAtlas')
    s+=region(648,606,568,420,COLORS[0],4)
    for i in range(5):
        s+=f'<path d="M80,{838+i*20} C210,610 864,369 1140,{590+i*20}" fill="none" stroke="{COLORS[0]}" opacity="{.18-i*.025}" stroke-width=".9"/>'
    image_url='https://borderline-verstehen-atlas-production.up.railway.app/assets/media/traumaatlas-mensch-und-verbindungen.jpg'
    clip=blob(632,573,428,337,2,.12)
    s+=f'<defs><clipPath id="lichtung"><path d="{clip}"/></clipPath></defs>'
    s+=f'<image x="110" y="226" width="1040" height="694" preserveAspectRatio="xMidYMid slice" clip-path="url(#lichtung)" href="{image_url}"/>'
    for j in range(5):
        s+=f'<path d="{blob(632,573,435+j*10,344+j*8,2,.12)}" stroke="{COLORS[0]}" stroke-width=".8" fill="none" opacity="{.5-j*.075}"/>'
    # A media place is distinct from a clinical relation. No autoplay in the design.
    s+=txt(632,972,'Mensch und Verbindungen',20,INK,'serif',anchor='middle')
    s+=txt(632,1003,'Bild aus dem bestehenden TraumaAtlas',14,MUTE,anchor='middle')
    s+=txt(1157,231,'KLANGORT',13,COLORS[0],weight=600,spacing=2.2)
    s+=txt(1154,302,['Trauma, Sicherheit','und Behandlung'],55,INK,'serif')
    s+=txt(1157,484,['Ähnliches Erleben ist','noch keine Diagnose.'],29,INK,'serif')
    s+=txt(1157,598,['Sicherheit und Schutz; diagnostische','Abgrenzung; die Grenzen von','Behandlungsstudien.'],22,MUTE)
    s+=txt(1157,758,'Audio anhören',20,INK,weight=500)
    s+='<circle cx="1331" cy="751" r="30" fill="none" stroke="#9D8146"/>'
    s+='<path d="M1326 741l14 10-14 10Z" fill="#173E4B"/>'
    s+=txt(1157,819,'Lesefassung   ·   Fachliche Einordnung',17,COLORS[0])
    s+=txt(1157,932,['NotebookLM · KI-Audioübersicht','Grundlage und Einordnung öffnen'],16,MUTE)
    s+=footer('TraumaAtlas  ·  Diagnose & Differenzierung  ·  Forschung & Einordnung')
    save('04-klanglichtung',s)

def mobile():
    w,h=430,1340
    s=begin(w,h)+mast('Beziehungen & Borderline',w)
    s+=txt(28,159,['Die Angst vor','Verlust ist groß'],43,INK,'serif')
    s+=region(219,475,209,209,COLORS[6],2)
    s+=line(144,414,296,527,'url(#contact)',11,.85,.1)
    s+=organism(144,414,71,COLORS[6],1031)
    s+=organism(296,527,63,RIGHT,1034)
    s+=txt(269,321,['Bedürfnis trifft','begrenzte Verfügbarkeit'],15,INK,anchor='middle')
    s+=txt(286,636,['Auch meine','Grenze gilt'],26,INK,'serif',anchor='middle')
    s+=txt(29,749,'Beim Abschied sagt Pat:',16,MUTE)
    s+=txt(28,793,['„Wenn du gehst, bin ich','dir wohl nicht wichtig.“'],27,INK,'serif')
    s+=txt(29,873,['Dabei ist nur ein Abend','allein geplant.'],17,INK)
    s+=txt(29,962,['Die Angst ist als Erleben ernst zu','nehmen. Sie beweist nicht, dass eine','Trennung bevorsteht, und verpflichtet','das Gegenüber nicht zu unbegrenzter','Rückversicherung.'],17,INK)
    s+=txt(29,1140,'Beobachtung  ·  Handlungsspielraum',15,COLORS[6])
    s+=txt(29,1236,'Zur Herkunft',16,MUTE)
    s+=txt(29,1304,'Zur Welt',15,INK)+txt(400,1304,'Ruhe',15,INK,anchor='end')
    save('05-begegnung-schmal',s)

def grammar():
    # A specification sheet, explicitly outside the proposed product surface.
    s=begin()+txt(62,57,'CODEX · GESTALTUNGSSPEZIFIKATION',14,INK,weight=600,spacing=2)
    s+=txt(62,149,'Wie eine Begegnung Form bekommt',59,INK,'serif')
    s+=txt(66,211,'Unbenannte Körper erklären die Bildsprache. Sie stellen kein klinisches Paar dar.',21,MUTE)
    s+=txt(80,300,'Vorbeiziehen',33,INK,'serif')
    s+=organism(295,416,60,LEFT,-1,arms=False)
    s+=organism(567,416,58,RIGHT,-2,arms=False)
    s+=line(180,467,398,467,LEFT,1,.5,0)+line(470,354,677,354,RIGHT,1,.5,0)
    s+=txt(80,551,['Ohne Fuge bleibt die Begegnung ohne Verbindung.','Nähe allein löst nichts aus.'],19,MUTE)
    s+=txt(972,300,'Einordnung',33,INK,'serif')
    s+=line(1147,416,1291,449,'url(#contact)',12,.8,.08)
    s+=organism(1147,416,68,LEFT,-1,arms=False)
    s+=organism(1291,449,62,RIGHT,-2,arms=False)
    s+=txt(972,551,['Farbe in einer gemeinsamen Berührungszone.','Die Körper wachsen beim Startfall nicht.'],19,MUTE)
    s+=txt(80,690,'Verstärkung',33,INK,'serif')
    s+=organism(205,822,39,LEFT,-1,arms=False)
    s+=organism(310,822,48,RIGHT,-2,arms=False)
    s+=line(405,822,486,822,MUTE,1,.65,0)
    s+='<path d="M479 817l7 5-7 5" fill="none" stroke="#526F79"/>'
    joined=math.sqrt((39**2+48**2)*1.2)
    s+=organism(604,822,joined,MIX,-3,arms=False)
    s+=region(604,822,joined*1.42,joined*1.18,MIX,2)
    s+=txt(80,965,['Nur nach belegter Fuge, Einrasten und geprüftem','Interaktionsbeleg. Die Darstellungskurve begrenzt','die Zusatzfläche auf höchstens 20 Prozent.'],19,MUTE)
    s+=txt(972,690,'Inkommensurabel',33,INK,'serif')
    s+=organism(1142,822,63,LEFT,-1,arms=False)
    s+=organism(1320,822,63,RIGHT,-2,arms=False)
    s+=txt(972,965,['Ein eigener begründeter Zustand: nebeneinander,','ohne Mischzone. Fehlende Belege reichen nicht,','um ihn einem realen Paar zuzuweisen.'],19,MUTE)
    s+=footer('Bedingte Entwurfsregel · kein quellengebundener Wachstumsfall behauptet')
    save('06-begegnungsgrammatik',s)

world();neighborhood();encounter();media();mobile();grammar()
(HERE/'ENTWURFSDATEN.json').write_text(json.dumps({
    'art':'Statische Design-Leinwände, keine Anwendung',
    'orte':len(P),'regionen':len(R),'fugen':len(F),
    'startort':1031,'startnachbarn':NEIGHBORS[1031],
    'farbraum':'OKLab','pigmente':[LEFT,RIGHT],'mischfarbe':MIX,
    'mischstufen':[oklab_mix(LEFT,RIGHT,j/8) for j in range(9)],
    'wachstum_startfall':False,'produktcode':False,
},ensure_ascii=False,indent=2)+'\n')
print('6 statische SVG-Leinwände erstellt; 1226 reale Orte, 10 Regionen, vier Startfugen. OKLab-Mitte:',MIX)
