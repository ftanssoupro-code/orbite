
"use strict";
/* ================= Données de base ================= */
const DOMAINS=[
 {k:'calcul',n:'Calcul mental',c:'#FFC145'},
 {k:'maths',n:'Maths & problèmes',c:'#FF9A5B'},
 {k:'logique',n:'Logique',c:'#B79CFF'},
 {k:'memoire',n:'Mémoire',c:'#5EE6B5'},
 {k:'francais',n:'Français',c:'#7CA8FF'},
 {k:'anglais',n:'Anglais',c:'#7CDCFF'},
 {k:'sciences',n:'Sciences',c:'#A3E38C'},
 {k:'histgeo',n:'Histoire-Géo',c:'#F7D37A'},
 {k:'culture',n:'Culture générale',c:'#FF8E72'},
 {k:'argent',n:'Argent & entreprise',c:'#FFE066'},
 {k:'code',n:'Pensée algorithmique',c:'#6FE3E3'},
 {k:'defi',n:'Raisonnement & expression',c:'#FF7AA2'},
];
const DM=Object.fromEntries(DOMAINS.map(d=>[d.k,d]));
const GRADES=['','CM1','CM2','6e','5e','4e','3e','2nde','1re','Terminale','Prépa / olympiades'];
const RANKS=[[0,'Explorateur'],[300,'Navigateur'],[900,'Pilote'],[2000,'Commandant'],[4000,'Amiral'],[8000,'Légende'],[15000,'Génie galactique']];

/* ================= Utilitaires ================= */
const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fmt=n=>Number(n).toLocaleString('fr-FR',{maximumFractionDigits:2});
const dayKey=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const gradeOf=L=>GRADES[clamp(Math.round(L),1,10)];
function h(tag,props,...kids){const el=document.createElement(tag);if(props)for(const[k,v]of Object.entries(props)){if(v==null||v===false)continue;if(k==='class')el.className=v;else if(k==='style')el.style.cssText=v;else if(k.startsWith('on'))el.addEventListener(k.slice(2),v);else el.setAttribute(k,v===true?'':v)}for(const k of kids.flat(Infinity)){if(k==null||k===false)continue;el.append(k instanceof Node?k:String(k))}return el}
const NS='http://www.w3.org/2000/svg';
function s(tag,attrs,...kids){const el=document.createElementNS(NS,tag);if(attrs)for(const[k,v]of Object.entries(attrs)){if(v==null)continue;if(k.startsWith('on'))el.addEventListener(k.slice(2),v);else el.setAttribute(k,v)}for(const k of kids.flat(Infinity)){if(k==null)continue;el.append(k instanceof Node?k:String(k))}return el}
const lsGet=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

/* ================= Banque de questions (bonne réponse en premier, mélangée à l'affichage) ================= */
const BANK={
francais:[
 [1,'Quel est le pluriel de « cheval » ?',['chevaux','chevals','chevaus','chevaul'],'Les noms en -al font en général leur pluriel en -aux.'],
 [1,'Dans « Le chat dort sur le canapé », quel est le verbe ?',['dort','chat','canapé','sur'],'Le verbe exprime l\'action : dormir, conjugué « dort ».'],
 [2,'Complète : « Nous ___ nos devoirs. » (finir, présent)',['finissons','finons','finirons','finissions'],'Finir est du 2e groupe : nous finissons.'],
 [2,'Lequel de ces mots est un adjectif ?',['rapide','courir','rapidement','vitesse'],'« Rapide » qualifie un nom. « Rapidement » est un adverbe.'],
 [3,'Complète : « Ils ___ partis hier. »',['sont','ont','son','on'],'Partir se conjugue avec l\'auxiliaire être au passé composé.'],
 [3,'Quel est le COD dans « Léa mange une pomme » ?',['une pomme','Léa','mange','il n\'y en a pas'],'Léa mange quoi ? Une pomme : c\'est le complément d\'objet direct.'],
 [4,'Passé simple de « venir », 3e personne du pluriel :',['ils vinrent','ils venirent','ils vînmes','ils venaient'],'Venir au passé simple : je vins, ils vinrent.'],
 [4,'« Cet homme est un lion. » Quelle figure de style ?',['une métaphore','une comparaison','une personnification','une hyperbole'],'Pas d\'outil de comparaison (comme, tel) : c\'est une métaphore.'],
 [4,'« Je viendrais si j\'avais le temps. » « Viendrais » est au…',['conditionnel présent','subjonctif présent','futur simple','imparfait'],'La terminaison -rais avec une condition (si…) marque le conditionnel.'],
 [5,'Complète : « Les fleurs que j\'ai ___ sont belles. »',['cueillies','cueilli','cueillis','cueillie'],'Avec avoir, le participe s\'accorde avec le COD placé avant : « que » = les fleurs (féminin pluriel).'],
 [5,'Que veut dire « procrastiner » ?',['remettre à plus tard','se dépêcher','protester','prévoir à l\'avance'],'Procrastiner : repousser sans cesse ce qu\'on doit faire.'],
 [5,'Un synonyme de « éphémère » :',['passager','éternel','épais','effrayant'],'Éphémère : qui dure très peu de temps.'],
 [6,'« Il faut que nous ___ attention. » (faire)',['fassions','faisions','ferions','faisons'],'Il faut que + subjonctif présent : que nous fassions.'],
 [6,'Dans « le livre dont je parle », « dont » est…',['un pronom relatif','une conjonction de coordination','une préposition','un adverbe'],'« Dont » remplace « du livre » et introduit une proposition relative.'],
 [6,'Combien de vers compte un sonnet ?',['14','12','10','16'],'Un sonnet : deux quatrains et deux tercets, soit 14 vers.'],
 [7,'Qu\'est-ce qu\'un alexandrin ?',['un vers de 12 syllabes','un vers de 10 syllabes','un poème de 14 vers','une strophe de 4 vers'],'L\'alexandrin est le grand vers classique français : 12 syllabes.'],
 [8,'Complète : « ___ soient tes raisons, tu dois t\'excuser. »',['Quelles que','Quelques','Quel que','Quelle que'],'« Quel que » s\'écrit en deux mots devant être et s\'accorde avec le sujet : raisons, féminin pluriel.'],
 [9,'« Cette obscure clarté qui tombe des étoiles » (Corneille) : quelle figure ?',['un oxymore','une métonymie','une litote','une anaphore'],'L\'oxymore rapproche deux mots contraires : obscure / clarté.'],
 [9,'« Va, je ne te hais point » (Le Cid) est un exemple de…',['litote','hyperbole','oxymore','anaphore'],'La litote dit moins pour faire entendre plus : Chimène avoue en fait qu\'elle aime Rodrigue.'],
 [10,'« Je voulais qu\'il ___ me voir. » (langue soutenue, venir)',['vînt','vienne','venait','viendrait'],'Concordance des temps classique : principale au passé → subjonctif imparfait, « qu\'il vînt ».'],
],
anglais:[
 [1,'How do you say « chien » in English?',['dog','cat','bird','horse'],'Chien = dog.'],
 [1,'« I ___ ten years old. »',['am','is','are','be'],'Avec I, le verbe to be devient « am ».'],
 [2,'Plural of « child »:',['children','childs','childrens','childes'],'Child → children est un pluriel irrégulier.'],
 [2,'« She ___ to school every day. »',['goes','go','going','gone'],'Présent simple, 3e personne du singulier : on ajoute -es à go.'],
 [3,'Past simple of « buy »:',['bought','buyed','brought','buy'],'Buy → bought (irrégulier). Brought vient de bring.'],
 [3,'« There ___ two apples on the table. »',['are','is','be','am'],'Pluriel (two apples) → there are.'],
 [4,'« I have lived here ___ 2020. »',['since','for','from','during'],'Since + point de départ (2020). For + durée (for five years).'],
 [4,'Opposite of « cheap »:',['expensive','cheerful','cheat','empty'],'Cheap = bon marché ; expensive = cher.'],
 [5,'« If it rains tomorrow, we ___ at home. »',['will stay','would stay','stayed','had stayed'],'Condition réelle : if + présent, will + verbe.'],
 [5,'« He is the ___ student in the class. »',['best','better','goodest','most good'],'Superlatif irrégulier : good → better → the best.'],
 [6,'« She asked me where I ___. »',['lived','do live','did live','am live'],'Discours indirect : pas d\'inversion et le temps recule (live → lived).'],
 [6,'What does « to give up » mean?',['abandonner','donner','monter','rendre visite'],'Give up = renoncer, abandonner.'],
 [7,'« If I ___ rich, I would travel the world. »',['were','am','will be','have been'],'Hypothèse irréelle : if + past (were pour toutes les personnes en anglais soigné).'],
 [7,'« By the time we arrived, the film ___. »',['had started','has started','starts','was start'],'Action antérieure à une autre action passée : past perfect.'],
 [8,'« I wish I ___ harder last year. »',['had studied','studied','have studied','would study'],'Regret sur le passé : wish + past perfect.'],
 [8,'What does « nevertheless » mean?',['néanmoins','jamais','plus jamais','en aucun cas'],'Nevertheless = néanmoins, pourtant.'],
 [9,'« Hardly ___ arrived when it started to rain. »',['had we','we had','did we','we have'],'Après hardly en tête de phrase, on inverse sujet et auxiliaire.'],
 [10,'Which word means « persuasif, convaincant » ?',['persuasive','pervasive','permissive','persistent'],'Pervasive = omniprésent ; permissive = tolérant ; persistent = tenace.'],
],
sciences:[
 [1,'Quel organe pompe le sang dans le corps ?',['le cœur','les poumons','le foie','l\'estomac'],'Le cœur est un muscle qui fait circuler le sang.'],
 [1,'À quelle température l\'eau pure gèle-t-elle (pression normale) ?',['0 °C','10 °C','100 °C','−10 °C'],'L\'eau gèle à 0 °C et bout à 100 °C.'],
 [2,'Quelle planète est la plus proche du Soleil ?',['Mercure','Vénus','Mars','la Terre'],'Ordre : Mercure, Vénus, Terre, Mars…'],
 [2,'Comment les plantes vertes fabriquent-elles leur matière ?',['par la photosynthèse','par la digestion','par la fermentation','en mangeant des insectes'],'Avec la lumière, l\'eau et le CO₂, elles fabriquent des sucres.'],
 [3,'Quel gaz les plantes absorbent-elles pour la photosynthèse ?',['le dioxyde de carbone','l\'oxygène','l\'azote','l\'hélium'],'Elles absorbent du CO₂ et rejettent de l\'oxygène.'],
 [3,'Combien d\'os compte environ le squelette d\'un adulte ?',['206','106','306','26'],'Environ 206 os ; un bébé en a davantage, certains fusionnent.'],
 [4,'Quelle est l\'unité de mesure d\'une force ?',['le newton','le joule','le watt','le pascal'],'Le joule mesure l\'énergie, le watt la puissance, le pascal la pression.'],
 [4,'Sous pression normale, l\'eau à 105 °C est…',['gazeuse','liquide','solide','impossible'],'Au-dessus de 100 °C, l\'eau pure est de la vapeur.'],
 [5,'Quelle est la formule chimique de l\'eau ?',['H₂O','CO₂','O₂','H₂O₂'],'Deux atomes d\'hydrogène et un d\'oxygène. H₂O₂ est l\'eau oxygénée.'],
 [5,'Qui a proposé la théorie de l\'évolution par sélection naturelle ?',['Charles Darwin','Isaac Newton','Louis Pasteur','Gregor Mendel'],'Darwin, « De l\'origine des espèces », 1859.'],
 [6,'Vitesse de la lumière dans le vide, environ :',['300 000 km/s','300 km/s','30 000 km/s','3 000 000 km/s'],'Environ 299 792 km/s : la lumière du Soleil met un peu plus de 8 minutes à nous parvenir.'],
 [6,'Dans une cellule animale, où se trouve l\'essentiel de l\'ADN ?',['dans le noyau','dans la membrane','dans la paroi','dans les ribosomes'],'L\'ADN est surtout dans le noyau (un peu dans les mitochondries).'],
 [7,'Un objet de 2 kg avance à 3 m/s. Son énergie cinétique vaut…',['9 J','6 J','18 J','3 J'],'Ec = ½ × m × v² = ½ × 2 × 9 = 9 J.'],
 [7,'Quelle particule porte une charge électrique négative ?',['l\'électron','le proton','le neutron','le photon'],'Le proton est positif, le neutron neutre.'],
 [8,'Quelle relation exprime la loi d\'Ohm ?',['U = R × I','U = R ÷ I','I = U × R','R = U × I'],'La tension U (volts) = résistance R (ohms) × intensité I (ampères).'],
 [8,'Quel est le pH d\'une solution neutre à 25 °C ?',['7','0','14','1'],'Sous 7 : acide. Au-dessus : basique.'],
 [9,'Pourquoi le ciel est-il bleu en journée ?',['l\'air diffuse davantage la lumière bleue','l\'océan s\'y reflète','l\'ozone est bleu','le Soleil émet surtout du bleu'],'Diffusion de Rayleigh : les courtes longueurs d\'onde (bleu) sont plus dispersées par les molécules de l\'air.'],
 [10,'Combien de chromosomes dans une cellule humaine non sexuelle ?',['46','23','48','44'],'23 paires, soit 46. Les gamètes en ont 23.'],
 [10,'Dans E = mc², que représente c ?',['la vitesse de la lumière','la charge électrique','la chaleur','la constante de gravitation'],'Einstein, 1905 : une petite masse contient une énergie énorme car c² est immense.'],
],
histgeo:[
 [1,'Quelle est la capitale du Maroc ?',['Rabat','Casablanca','Marrakech','Fès'],'Casablanca est la plus grande ville, mais la capitale est Rabat.'],
 [1,'Quel est le plus grand océan du monde ?',['le Pacifique','l\'Atlantique','l\'océan Indien','l\'Arctique'],'Le Pacifique couvre environ un tiers de la surface de la Terre.'],
 [2,'Quel est le plus long fleuve d\'Afrique ?',['le Nil','le Congo','le Niger','le Zambèze'],'Le Nil mesure environ 6 650 km.'],
 [3,'Quelle chaîne de montagnes traverse le Maroc ?',['l\'Atlas','les Alpes','l\'Himalaya','les Andes'],'Le Haut Atlas culmine au Toubkal (4 167 m).'],
 [3,'Quelle ligne imaginaire sépare les hémisphères Nord et Sud ?',['l\'équateur','le méridien de Greenwich','le tropique du Cancer','le cercle polaire'],'Le méridien de Greenwich sépare l\'Est et l\'Ouest.'],
 [3,'En quelle année Christophe Colomb atteint-il l\'Amérique ?',['1492','1515','1789','1066'],'Le 12 octobre 1492, aux Bahamas.'],
 [4,'Quel événement commence en France en 1789 ?',['la Révolution française','la Première Guerre mondiale','la Renaissance','la chute de Rome'],'Prise de la Bastille : 14 juillet 1789.'],
 [4,'Le tombeau de quel pharaon a été découvert presque intact en 1922 ?',['Toutânkhamon','Ramsès II','Khéops','Akhenaton'],'Découvert par Howard Carter dans la Vallée des Rois.'],
 [5,'En quelle année le Maroc retrouve-t-il son indépendance ?',['1956','1912','1962','1944'],'Fin du protectorat en 1956, sous le sultan Mohammed V.'],
 [5,'Quel pays est le plus peuplé du monde aujourd\'hui ?',['l\'Inde','la Chine','les États-Unis','l\'Indonésie'],'L\'Inde a dépassé la Chine en 2023.'],
 [6,'Qui fut le premier empereur romain ?',['Auguste','Jules César','Néron','Constantin'],'Jules César n\'a jamais porté le titre d\'empereur ; Auguste règne à partir de 27 av. J.-C.'],
 [6,'Le détroit de Gibraltar sépare…',['l\'Europe et l\'Afrique','l\'Europe et l\'Asie','l\'Afrique et l\'Asie','l\'Europe et l\'Amérique'],'Environ 14 km entre l\'Espagne et le Maroc.'],
 [6,'Ibn Battuta, né à Tanger, est célèbre comme…',['voyageur et explorateur','mathématicien','sultan','architecte'],'Au XIVe siècle, il a parcouru environ 120 000 km, de l\'Afrique à la Chine.'],
 [7,'En quelle année se termine la Seconde Guerre mondiale ?',['1945','1918','1939','1950'],'1939-1945. La Première Guerre mondiale se termine en 1918.'],
 [7,'Que met en place le traité de Fès de 1912 ?',['le protectorat français sur le Maroc','l\'indépendance du Maroc','l\'union du Maghreb','la fin de l\'Empire ottoman'],'Le protectorat durera de 1912 à 1956.'],
 [8,'Quelle dynastie a fondé la ville de Fès ?',['les Idrissides','les Almoravides','les Mérinides','les Alaouites'],'Fondée à la fin du VIIIe siècle par Idris Ier, développée par Idris II.'],
 [9,'En quelle année tombe le mur de Berlin ?',['1989','1991','1961','1975'],'Construit en 1961, il tombe le 9 novembre 1989.'],
 [10,'Quelle dynastie a construit la mosquée de la Koutoubia à Marrakech ?',['les Almohades','les Saadiens','les Alaouites','les Mérinides'],'Construite au XIIe siècle sous les Almohades.'],
 [10,'Les traités de Westphalie (1648) mettent fin à…',['la guerre de Trente Ans','la guerre de Cent Ans','les guerres napoléoniennes','la guerre de Sept Ans'],'Ils fondent aussi l\'idée moderne d\'États souverains.'],
],
culture:[
 [1,'Combien de jours compte une année bissextile ?',['366','365','364','360'],'Un 29 février s\'ajoute tous les 4 ans (en général).'],
 [1,'Quel est le plus grand animal du monde ?',['la baleine bleue','l\'éléphant d\'Afrique','la girafe','le requin blanc'],'Elle peut dépasser 25 m et 100 tonnes.'],
 [2,'Qui a peint la Joconde ?',['Léonard de Vinci','Pablo Picasso','Vincent van Gogh','Michel-Ange'],'Peinte au début du XVIe siècle, elle est au Louvre.'],
 [3,'Combien de joueurs par équipe sur un terrain de football ?',['11','10','9','12'],'10 joueurs de champ + 1 gardien.'],
 [4,'Qui a cofondé Microsoft avec Paul Allen ?',['Bill Gates','Steve Jobs','Elon Musk','Mark Zuckerberg'],'Microsoft a été fondée en 1975.'],
 [4,'Quelle est la monnaie du Japon ?',['le yen','le yuan','le won','le baht'],'Le yuan est chinois, le won coréen, le baht thaïlandais.'],
 [5,'Qui a écrit « Le Petit Prince » ?',['Antoine de Saint-Exupéry','Victor Hugo','Jules Verne','Molière'],'Publié en 1943, c\'est l\'un des livres les plus traduits au monde.'],
 [5,'Le mot « algèbre » vient du titre d\'un livre de…',['Al-Khwarizmi','Pythagore','Euclide','Ibn Sina'],'Son traité « al-jabr » (IXe siècle) a donné « algèbre », et son nom a donné « algorithme ». Comme le nom de ton école !'],
 [6,'Combien de touches possède un piano standard ?',['88','76','100','64'],'52 blanches et 36 noires.'],
 [6,'Qui a formulé la théorie de la relativité ?',['Albert Einstein','Isaac Newton','Galilée','Marie Curie'],'Relativité restreinte en 1905, générale en 1915.'],
 [7,'Quelle est la première femme à avoir reçu un prix Nobel ?',['Marie Curie','Rosalind Franklin','Ada Lovelace','Simone Veil'],'Nobel de physique 1903, puis de chimie 1911.'],
 [7,'Qu\'appelle-t-on une « licorne » dans le monde des start-up ?',['une entreprise non cotée valorisée plus d\'un milliard de dollars','une entreprise qui ne gagne pas d\'argent','une entreprise fondée par un enfant','une entreprise publique'],'Le terme vient de la rareté de ces entreprises.'],
 [8,'Quelle université, fondée à Fès en 859, est souvent citée comme la plus ancienne encore en activité ?',['Al Quaraouiyine','Al-Azhar','Bologne','Oxford'],'Fondée par Fatima al-Fihri.'],
 [9,'Qui est l\'auteur de « L\'Art de la guerre » ?',['Sun Tzu','Machiavel','Confucius','Clausewitz'],'Traité chinois de stratégie, environ Ve siècle av. J.-C.'],
 [10,'Ibn Khaldoun (XIVe siècle) est souvent présenté comme un précurseur de…',['la sociologie','la chimie','l\'astronomie','la médecine'],'Sa « Muqaddima » analyse les sociétés, l\'économie et l\'histoire.'],
],
logique:[
 [2,'Pierre est plus grand que Paul. Paul est plus grand que Jean. Qui est le plus petit ?',['Jean','Paul','Pierre','On ne peut pas savoir'],'Pierre > Paul > Jean.'],
 [2,'Tous les chats sont des animaux. Félix est un chat. Donc…',['Félix est un animal','tous les animaux sont des chats','Félix n\'est pas un animal','on ne peut rien dire'],'C\'est un syllogisme : la conclusion est certaine.'],
 [4,'Le père de Marie a 5 filles : Nana, Nene, Nini, Nono. Comment s\'appelle la 5e ?',['Marie','Nunu','Nane','On ne peut pas savoir'],'Relis le début : c\'est le père de Marie !'],
 [5,'Une batte et une balle coûtent 1,10 € au total. La batte coûte 1 € de plus que la balle. Combien coûte la balle ?',['0,05 €','0,10 €','0,01 €','1 €'],'Si la balle coûte x, la batte coûte x + 1. Donc 2x + 1 = 1,10, x = 0,05 €.'],
 [6,'5 machines fabriquent 5 objets en 5 minutes. Combien de minutes faut-il à 100 machines pour 100 objets ?',['5','100','20','1'],'Chaque machine fait 1 objet en 5 minutes, quel que soit le nombre de machines.'],
 [6,'Un nénuphar double de surface chaque jour et couvre tout le lac en 48 jours. En combien de jours en couvre-t-il la moitié ?',['47','24','46','12'],'La veille du dernier jour, il couvrait la moitié.'],
 [7,'Un escargot au fond d\'un puits de 10 m monte de 3 m le jour et redescend de 2 m la nuit. Au bout de combien de jours sort-il ?',['8','10','7','9'],'Après 7 jours et nuits il est à 7 m ; le 8e jour il monte de 3 m et sort.'],
 [8,'De midi à minuit (exclu), combien de fois les aiguilles des heures et des minutes se superposent-elles ?',['11','12','10','24'],'Elles se rejoignent toutes les 12/11 d\'heure, soit 11 fois en 12 heures.'],
 [10,'Combien de carrés de toutes tailles y a-t-il sur un échiquier 8 × 8 ?',['204','64','100','256'],'1² + 2² + … + 8² = 204.'],
],
code:[
 [3,'Qu\'est-ce qu\'un algorithme ?',['une suite d\'instructions pour résoudre un problème','un ordinateur très rapide','un langage secret','un virus informatique'],'Une recette de cuisine est déjà un algorithme.'],
 [5,'En binaire, 1011 vaut combien en décimal ?',['11','9','13','1011'],'1×8 + 0×4 + 1×2 + 1×1 = 11.'],
 [7,'Combien de valeurs différentes peut-on coder sur 8 bits ?',['256','255','128','64'],'2⁸ = 256 (de 0 à 255).'],
 [8,'Recherche dichotomique dans une liste triée de 1 000 éléments : nombre maximal d\'étapes, environ ?',['10','100','500','1 000'],'On coupe en deux à chaque étape : 2¹⁰ = 1 024.'],
],
argent:[
 [3,'Qu\'est-ce qu\'un bénéfice ?',['ce qui reste quand on retire les coûts des ventes','le prix de vente','l\'argent qu\'on emprunte','le salaire du patron'],'Bénéfice = recettes − dépenses.'],
 [6,'Quelle est la meilleure définition d\'un « actif » ?',['quelque chose qui rapporte ou garde de la valeur','une dépense quotidienne','une dette','un impôt'],'Acheter des actifs plutôt que des dépenses : une idée clé pour s\'enrichir.'],
],
};

const DEFIS=[
 'Tu dois convaincre la directrice d\'ajouter 15 minutes de lecture libre par jour. Donne 3 arguments solides et réponds à une objection.',
 'Invente une entreprise qui résout un vrai problème au Maroc. Décris le problème, ta solution, tes clients et comment tu gagnes de l\'argent.',
 'Explique avec tes mots pourquoi la Lune ne tombe pas sur la Terre.',
 'Une vidéo dit : « Les requins tuent 10 000 personnes par an. » Comment ferais-tu pour vérifier si c\'est vrai ?',
 'Si tu étais ministre de l\'Éducation pendant un an, quelles seraient tes 3 premières décisions et pourquoi ?',
 'Pourquoi, selon toi, certains pays sont-ils plus riches que d\'autres ? Donne au moins 3 raisons.',
 'Raconte une histoire de 8 à 10 phrases qui commence par : « Le jour où les écrans se sont éteints… »',
 'Imagine que tu as 1 000 dirhams pour faire grandir ton argent en un an, sans risque dangereux. Quel est ton plan ?',
 'Est-ce juste que les meilleurs joueurs de football gagnent plus qu\'un médecin ? Défends une position, puis donne l\'argument contraire.',
 'Comment expliquerais-tu à un enfant de 6 ans ce qu\'est une fraction ?',
 'Un ami triche à un contrôle et te demande de ne rien dire. Que fais-tu ? Explique ton raisonnement.',
 'Quelle invention a le plus changé l\'humanité selon toi ? Justifie ton choix face à deux autres inventions.',
 'Trouve 5 utilisations surprenantes pour une brique. Puis choisis la meilleure et explique pourquoi.',
 'Pourquoi apprendre plusieurs langues peut-il aider à réussir ? Donne des exemples concrets.',
 'L\'intelligence artificielle va-t-elle aider ou gêner les élèves ? Donne les deux côtés et ta conclusion.',
 'Décris un problème de ton école ou de ton quartier et propose un plan en 4 étapes pour le résoudre.',
 'Si tu pouvais poser une seule question à Ibn Khaldoun, Einstein ou Marie Curie, laquelle et pourquoi ?',
 'Comment une ville pourrait-elle consommer deux fois moins d\'eau ? Propose au moins 4 idées.',
 'Explique pourquoi on dit « le temps, c\'est de l\'argent ». Es-tu d\'accord ?',
 'Tu lances une limonade devant l\'école : le verre te coûte 2 DH à préparer. À quel prix le vends-tu et pourquoi ?',
];

/* ================= Générateurs (questions infinies) ================= */
function num(d,lvl,q,answer,expl,extra){return Object.assign({d,lvl,type:'num',q,answer,expl,src:'gen'},extra||{})}
function mcq(d,lvl,q,choices,expl,extra){return Object.assign({d,lvl,type:'mcq',q,choices,expl,src:'gen'},extra||{})}
const GEN={
 calcul(l){
  let a,b,r,q,e;
  switch(l){
   case 1:a=ri(12,49);b=ri(11,49);r=a+b;q=`${a} + ${b}`;break;
   case 2:a=ri(12,29);b=ri(3,9);r=a*b;q=`${a} × ${b}`;e=`${a} × ${b} = ${Math.floor(a/10)*10} × ${b} + ${a%10} × ${b}`;break;
   case 3:a=ri(400,950);b=ri(120,399);r=a-b;q=`${a} − ${b}`;break;
   case 4:a=ri(12,19);b=ri(11,19);r=a*b;q=`${a} × ${b}`;e=`${a} × ${b} = ${a} × 10 + ${a} × ${b-10}`;break;
   case 5:b=ri(3,9);r=ri(21,99);a=b*r;q=`${a} ÷ ${b}`;break;
   case 6:a=pick([0.25,0.5,1.5,2.5]);b=ri(2,24)*4;r=a*b;q=`${fmt(a)} × ${b}`;break;
   case 7:a=ri(2,9)*10+5;r=a*a;q=`${a}²`;e=`Astuce : pour un nombre finissant par 5, d × (d+1) puis 25. Ici ${Math.floor(a/10)} × ${Math.floor(a/10)+1} = ${Math.floor(a/10)*(Math.floor(a/10)+1)}, donc ${r}.`;break;
   case 8:a=pick([5,10,15,20,25,30,40,75]);b=ri(4,40)*20;r=a*b/100;q=`${a} % de ${b}`;e=`${a} % de ${b} = ${b} × ${a} ÷ 100 = ${fmt(r)}`;break;
   case 9:a=ri(3,9)*10;b=ri(1,4);r=(a-b)*(a+b);q=`${a-b} × ${a+b}`;e=`Astuce : (a − b)(a + b) = a² − b² = ${a*a} − ${b*b} = ${r}`;break;
   default:if(Math.random()<.5){a=ri(10,13);b=ri(4,6);r=2**a-3**b;q=`2^${a} − 3^${b}`;e=`2^${a} = ${2**a} et 3^${b} = ${3**b}`}else{a=ri(21,39);r=a;q=`√${a*a}`;e=`${a} × ${a} = ${a*a}`}
  }
  return num('calcul',l,`Calcule : ${q}`,r,e||`Réponse : ${fmt(r)}`,{timed:true});
 },
 maths(l){
  let a,b,c,x,r;
  switch(l){
   case 1:a=ri(3,12);b=pick([[2,'La moitié'],[3,'Le tiers'],[4,'Le quart']]);return num('maths',l,`${b[1]} de ${a*b[0]}, c\'est combien ?`,a,`${a*b[0]} ÷ ${b[0]} = ${a}`);
   case 2:a=ri(6,20);b=ri(2,a-1);return num('maths',l,`Un rectangle mesure ${a} cm de long et ${b} cm de large. Quel est son périmètre ?`,2*(a+b),`P = 2 × (${a} + ${b}) = ${2*(a+b)} cm`,{unit:'cm'});
   case 3:if(Math.random()<.5){a=ri(4,15);b=ri(3,12);return num('maths',l,`Quelle est l\'aire d\'un rectangle de ${a} cm sur ${b} cm ?`,a*b,`A = ${a} × ${b} = ${a*b} cm²`,{unit:'cm²'})}a=ri(2,9);return num('maths',l,`Combien font les 3/4 de ${a*4} ?`,a*3,`${a*4} ÷ 4 = ${a}, puis × 3 = ${a*3}`);
   case 4:a=ri(2,5);b=ri(2,9);c=ri(6,12);return num('maths',l,`${a} cahiers coûtent ${a*b} DH. Combien coûtent ${c} cahiers ?`,b*c,`1 cahier coûte ${a*b} ÷ ${a} = ${b} DH, donc ${c} × ${b} = ${b*c} DH.`,{unit:'DH'});
   case 5:a=ri(2,9);x=ri(2,15);b=ri(1,20);return num('maths',l,`Trouve x : ${a}x + ${b} = ${a*x+b}`,x,`${a}x = ${a*x+b} − ${b} = ${a*x}, donc x = ${x}.`);
   case 6:if(Math.random()<.5){a=ri(2,10)*2;b=ri(3,15);return num('maths',l,`Aire d\'un triangle de base ${a} cm et de hauteur ${b} cm ?`,a*b/2,`A = base × hauteur ÷ 2 = ${a} × ${b} ÷ 2 = ${a*b/2} cm²`,{unit:'cm²'})}
     a=ri(2,20)*50;b=pick([10,20,25]);return num('maths',l,`Un vélo coûte ${a} DH. Son prix augmente de ${b} %. Quel est le nouveau prix ?`,a*(1+b/100),`${a} × ${b} ÷ 100 = ${a*b/100}, donc ${a} + ${a*b/100} = ${fmt(a*(1+b/100))} DH`,{unit:'DH'});
   case 7:a=ri(5,9);c=ri(1,a-1);x=ri(2,12);b=ri(1,(a-c)*x-1);{const d=(a-c)*x-b;return num('maths',l,`Résous : ${a}x − ${b} = ${c===1?'':c}x + ${d}`,x,`${a-c}x = ${d} + ${b} = ${d+b}, donc x = ${x}.`)}
   case 8:{const t=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);const k=t[0]===3?ri(1,4):1;return num('maths',l,`Un triangle rectangle a deux côtés de l\'angle droit de ${t[0]*k} et ${t[1]*k}. Combien mesure l\'hypoténuse ?`,t[2]*k,`Pythagore : ${t[0]*k}² + ${t[1]*k}² = ${(t[0]*k)**2 + (t[1]*k)**2} = ${t[2]*k}²`)}
   case 9:{const S=ri(3,11);const w=6-Math.abs(S-7);const fr=(n)=>{const g=gcd(n,36);return `${n/g}/${36/g}`};const right=fr(w);const pool=new Set([right]);[1,2,3,4,5,6].forEach(n=>pool.add(fr(n)));pool.add('1/2');const others=shuffle([...pool].filter(v=>v!==right)).slice(0,3);return mcq('maths',l,`On lance deux dés à 6 faces. Quelle est la probabilité que la somme fasse ${S} ?`,[right,...others],`Il y a 36 résultats possibles, dont ${w} donnent ${S} : ${w}/36 = ${right}.`)}
   default:if(Math.random()<.5){a=ri(20,100);return num('maths',l,`Calcule 1 + 2 + 3 + … + ${a}`,a*(a+1)/2,`Astuce de Gauss : ${a} × ${a+1} ÷ 2 = ${a*(a+1)/2}`)}a=ri(6,15);return num('maths',l,`Combien de diagonales possède un polygone convexe à ${a} côtés ?`,a*(a-3)/2,`Chaque sommet se relie à ${a-3} autres, et chaque diagonale est comptée deux fois : ${a} × ${a-3} ÷ 2 = ${a*(a-3)/2}.`);
  }
 },
 logique(l){
  let t=[],r,e;
  if(l<=2){const a=ri(1,20),d=l===1?ri(2,6):pick([-3,-4,7,9,11]);const st=d<0?a+40:a;for(let i=0;i<5;i++)t.push(st+i*d);r=st+5*d;e=`On ajoute ${d} à chaque fois.`}
  else if(l<=4){const a=ri(1,5),q=l===3?2:3;for(let i=0;i<5;i++)t.push(a*q**i);r=a*q**5;e=`On multiplie par ${q} à chaque fois.`}
  else if(l<=6){const a=ri(1,10),d=ri(1,4),k=ri(1,3);let v=a,dd=d;for(let i=0;i<6;i++){t.push(v);v+=dd;dd+=k}r=t.pop();e=`Les écarts augmentent de ${k} à chaque fois (${d}, ${d+k}, ${d+2*k}…).`}
  else if(l===7){const a=ri(1,9),b=ri(20,40),da=ri(2,5),db=ri(2,4);for(let i=0;i<6;i++)t.push(i%2?b-db*Math.floor(i/2):a+da*(i/2));r=a+da*3;e=`Deux suites mélangées : une monte de ${da}, l\'autre descend de ${db}.`}
  else if(l===8){let a=ri(1,4),b=ri(2,6);t=[a,b];for(let i=0;i<4;i++)t.push(t[t.length-1]+t[t.length-2]);r=t[t.length-1]+t[t.length-2];e='Chaque terme est la somme des deux précédents (comme la suite de Fibonacci).'}
  else if(l===9){const c=ri(-3,5),p=pick([2,3]);for(let i=1;i<=5;i++)t.push(i**p+c);r=6**p+c;e=`n${p===2?'²':'³'} ${c>=0?'+':'−'} ${Math.abs(c)}`}
  else{if(Math.random()<.5){let v=ri(1,3);for(let i=0;i<5;i++){t.push(v);v=2*v+1}r=v;e='Chaque terme = 2 × précédent + 1.'}else{t=[2,3,5,7,11,13];const ps=[17,19,23];r=ps[0];e='Ce sont les nombres premiers.'}}
  return num('logique',l,`Quel nombre vient ensuite ?\n${t.join('   ')}   ?`,r,e);
 },
 memoire(l){
  const back=l>=6;const len=back?l-1:3+l;let d='';for(let i=0;i<len;i++)d+=ri(0,9);
  return {d:'memoire',lvl:l,type:'memory',digits:d,back,show:Math.round(len*900+600),q:back?`Mémorise ces ${len} chiffres, puis écris-les À L\'ENVERS.`:`Mémorise ces ${len} chiffres, puis écris-les dans l\'ordre.`,answer:back?[...d].reverse().join(''):d,expl:`La suite était ${d}${back?' ; à l\'envers : '+[...d].reverse().join(''):''}.`,src:'gen'};
 },
 argent(l){
  let a,b,c,p;
  switch(l){
   case 1:a=ri(11,95);b=pick([10,20,50].filter(v=>v*10>a));return num('argent',l,`Tu achètes un jus à ${fmt(a/10)} DH et tu paies avec ${b} DH. Combien te rend-on ?`,(b*10-a)/10,`${b} − ${fmt(a/10)} = ${fmt((b*10-a)/10)} DH`,{unit:'DH'});
   case 2:a=ri(2,5);b=ri(3,15);c=ri(5,30);return num('argent',l,`Tu achètes ${a} cahiers à ${b} DH et un livre à ${c} DH. Total ?`,a*b+c,`${a} × ${b} + ${c} = ${a*b+c} DH`,{unit:'DH'});
   case 3:a=ri(4,40)*10;p=pick([10,20,25,50]);return num('argent',l,`Des baskets à ${a} DH sont soldées à −${p} %. Quel est le prix soldé ?`,a*(1-p/100),`Remise : ${a} × ${p} ÷ 100 = ${a*p/100} DH. Prix : ${fmt(a*(1-p/100))} DH.`,{unit:'DH'});
   case 4:{const n1=ri(3,8);let n2=ri(3,8);if(n2===n1)n2=n1+1;const u1=ri(3,9);const u2=u1+pick([-1,1]);const p1=n1*u1,p2=n2*u2;const ans=u1<u2?0:1;return mcq('argent',l,`Pack A : ${n1} yaourts pour ${p1} DH. Pack B : ${n2} yaourts pour ${p2} DH. Quel pack est le moins cher par yaourt ?`,ans===0?['Pack A','Pack B','Le même prix','Impossible à savoir']:['Pack B','Pack A','Le même prix','Impossible à savoir'],`A : ${p1} ÷ ${n1} = ${u1} DH le yaourt. B : ${p2} ÷ ${n2} = ${u2} DH.`)}
   case 5:a=ri(5,20);b=a+ri(3,15);c=ri(10,50);return num('argent',l,`Tu achètes ${c} bracelets à ${a} DH pièce et tu les revends ${b} DH pièce. Quel est ton bénéfice total ?`,c*(b-a),`Bénéfice par bracelet : ${b} − ${a} = ${b-a} DH. Total : ${c} × ${b-a} = ${c*(b-a)} DH.`,{unit:'DH'});
   case 6:a=pick([20,40,50,80,100,200]);p=pick([10,20,25,50,75]);return num('argent',l,`Un commerçant achète un objet ${a} DH et le revend ${fmt(a*(1+p/100))} DH. Quel est son taux de marge (en % du prix d\'achat) ?`,p,`(${fmt(a*(1+p/100))} − ${a}) ÷ ${a} × 100 = ${p} %`,{unit:'%'});
   case 7:a=pick([1000,2000,5000]);p=pick([10,20]);return num('argent',l,`Tu places ${a} DH à ${p} % par an, intérêts composés. Combien as-tu après 2 ans ?`,Math.round(a*(1+p/100)**2),`Année 1 : ${fmt(a*(1+p/100))}. Année 2 : ${fmt(a*(1+p/100)**2)} DH. Les intérêts rapportent eux aussi des intérêts.`,{unit:'DH'});
   case 8:a=pick([100,200,500,1000]);p=pick([10,20,25,50]);return num('argent',l,`Une action vaut ${a} DH. Elle monte de ${p} %, puis baisse de ${p} %. Combien vaut-elle maintenant ?`,a*(1+p/100)*(1-p/100),`${a} × ${1+p/100} × ${1-p/100} = ${fmt(a*(1+p/100)*(1-p/100))} DH. Une hausse puis une baisse du même % font perdre de l\'argent !`,{unit:'DH'});
   case 9:p=pick([6,8,9,12]);return num('argent',l,`Règle de 72 : un placement rapporte ${p} % par an (intérêts composés). En combien d\'années environ ton argent double-t-il ?`,72/p,`72 ÷ ${p} = ${72/p} ans.`,{unit:'ans'});
   default:a=ri(1,8)*1000;return num('argent',l,`Une start-up fait ${fmt(a)} DH de chiffre d\'affaires. Il augmente de 50 % chaque année pendant 3 ans. Quel est le chiffre d\'affaires final ?`,a*3.375,`${fmt(a)} × 1,5 × 1,5 × 1,5 = ${fmt(a*3.375)} DH`,{unit:'DH'});
  }
 },
 code(l){
  let lines,r;
  switch(l){
   case 1:{const a=ri(2,9),b=ri(2,9);lines=[`x ← ${a}`,`x ← x + ${b}`,`x ← x × 2`,`afficher x`];r=(a+b)*2;break}
   case 2:{const a=ri(1,5),b=ri(2,6),n=ri(3,6);lines=[`x ← ${a}`,`répéter ${n} fois :`,`    x ← x + ${b}`,`afficher x`];r=a+n*b;break}
   case 3:{const a=ri(1,3),n=ri(3,6);lines=[`x ← ${a}`,`répéter ${n} fois :`,`    x ← x × 2`,`afficher x`];r=a*2**n;break}
   case 4:{const n=ri(5,12);lines=[`s ← 0`,`pour i de 1 à ${n} :`,`    s ← s + i`,`afficher s`];r=n*(n+1)/2;break}
   case 5:{const a=ri(5,30),b=ri(5,30);lines=[`x ← ${a}`,`si x > ${b} alors`,`    x ← x − ${b}`,`sinon`,`    x ← ${b} − x`,`afficher x × 3`];r=(a>b?a-b:b-a)*3;break}
   case 6:{let n=ri(20,200);const n0=n;let c=0;while(n>1){n=Math.floor(n/2);c++}lines=[`n ← ${n0}`,`c ← 0`,`tant que n > 1 :`,`    n ← partie entière de (n ÷ 2)`,`    c ← c + 1`,`afficher c`];r=c;break}
   case 7:{const n=ri(6,14);let s=0;for(let i=1;i<=n;i++)if(i%2===0)s+=i;lines=[`s ← 0`,`pour i de 1 à ${n} :`,`    si i est pair alors`,`        s ← s + i`,`afficher s`];r=s;break}
   case 8:{let a=ri(1,3),b=ri(1,4);const a0=a,b0=b,n=ri(4,6);for(let i=0;i<n;i++){const t=a;a=b;b=t+b}lines=[`a ← ${a0}`,`b ← ${b0}`,`répéter ${n} fois :`,`    t ← a`,`    a ← b`,`    b ← t + b`,`afficher a`];r=a;break}
   case 9:{const L=Array.from({length:7},()=>ri(1,30));r=L.filter(v=>v%3===0).reduce((x,y)=>x+y,0);lines=[`L ← [${L.join(', ')}]`,`c ← 0`,`pour chaque v dans L :`,`    si v est divisible par 3 alors`,`        c ← c + v`,`afficher c`];break}
   default:{if(Math.random()<.5){const k=ri(4,7);let f=1;for(let i=2;i<=k;i++)f*=i;lines=[`fonction f(n) :`,`    si n ≤ 1 alors retourner 1`,`    sinon retourner n × f(n − 1)`,`afficher f(${k})`];r=f}else{const k=ri(7,11);const F=[0,1];for(let i=2;i<=k;i++)F.push(F[i-1]+F[i-2]);lines=[`fonction f(n) :`,`    si n ≤ 1 alors retourner n`,`    sinon retourner f(n − 1) + f(n − 2)`,`afficher f(${k})`];r=F[k]}}
  }
  return num('code',l,'Que va afficher ce programme ?',r,`Le programme affiche ${fmt(r)}. Suis chaque ligne et note la valeur des variables.`,{code:lines.join('\n')});
 },
};
const PROCEDURAL=new Set(['calcul','maths','memoire']);
const MIXED={logique:.4,code:.25,argent:.2}; // part de questions tirées de la banque / de l'IA

/* ================= État & stockage (Supabase) ================= */
function defaultState(){const levels={};DOMAINS.forEach(d=>levels[d.k]=3);return{v:1,name:'',birth:'2016-01-05',classe:'6e',levels,xp:0,streak:0,bestStreak:0,lastDay:null,total:0,correct:0,placementDone:false,missionLen:12,parentCode:'',sprintBest:0,seen:[],aiStems:[],counts:{}}}
function normalize(x){const d=defaultState();x=x&&typeof x==='object'?x:{};const o=Object.assign(d,x);o.levels=Object.assign(defaultState().levels,x.levels||{});for(const k in o.levels)o.levels[k]=clamp(Number(o.levels[k])||3,1,10);o.counts=Object.assign({},x.counts||{});o.seen=Array.isArray(x.seen)?x.seen.slice(-250):[];o.aiStems=Array.isArray(x.aiStems)?x.aiStems.slice(-60):[];return o}
let sb=null,user=null,CFG=null,syncOK=true;
const pendKey=()=>'orbite.pending.'+(user?user.id:'x');
const Store={S:normalize(null),sessions:[],ready:false,chain:Promise.resolve(),
 async load(){
  const cached=lsGet('orbite.state.'+user.id);if(cached)this.S=normalize(cached);
  const r1=await sb.from('state').select('data').eq('user_id',user.id).maybeSingle();
  if(r1.error)throw r1.error;
  if(r1.data)this.S=normalize(r1.data.data);else{const r=await sb.from('state').upsert({user_id:user.id,data:JSON.parse(JSON.stringify(this.S))});if(r.error)throw r.error}
  const r2=await sb.from('sessions').select('data').eq('user_id',user.id).order('ts',{ascending:false}).limit(400);
  if(r2.error)throw r2.error;
  this.sessions=(r2.data||[]).map(r=>r.data).reverse();
  const pend=lsGet(pendKey())||[];
  if(pend.length){const ids=new Set(this.sessions.map(x=>x.id));pend.forEach(x=>{if(!ids.has(x.id))this.sessions.push(x)});this.flush()}
  lsSet('orbite.state.'+user.id,this.S);this.ready=true;setSync(true);
 },
 save(){const copy=JSON.parse(JSON.stringify(this.S));if(user)lsSet('orbite.state.'+user.id,copy);
  this.chain=this.chain.then(async()=>{const r=await sb.from('state').upsert({user_id:user.id,data:copy,updated_at:new Date().toISOString()});if(r.error)throw r.error;setSync(true)}).catch(e=>{console.warn(e);setSync(false)})},
 addSession(x){this.sessions.push(x);const pend=lsGet(pendKey())||[];pend.push(x);lsSet(pendKey(),pend);this.flush()},
 flush(){this.chain=this.chain.then(async()=>{const pend=lsGet(pendKey())||[];if(!pend.length)return;const r=await sb.from('sessions').upsert(pend.map(x=>({id:x.id,user_id:user.id,ts:x.ts,day:x.day,data:x})));if(r.error)throw r.error;lsSet(pendKey(),[]);setSync(true)}).catch(e=>{console.warn(e);setSync(false)})},
};
function setSync(v){if(syncOK===v)return;syncOK=v;const el=document.getElementById('sync');if(el)el.replaceWith(storageNote())}
window.addEventListener('online',()=>{if(user){Store.flush();Store.save()}});
const S=()=>Store.S;
const globalLevel=(lv=S().levels)=>DOMAINS.reduce((a,d)=>a+(lv[d.k]||3),0)/DOMAINS.length;
const rankOf=xp=>{let r=RANKS[0],nx=null;for(let i=0;i<RANKS.length;i++){if(xp>=RANKS[i][0]){r=RANKS[i];nx=RANKS[i+1]||null}}return{name:r[1],min:r[0],next:nx}};
const birthOf=st=>{const d=new Date((st.birth||'2016-01-05')+'T00:00:00');return isNaN(d)?new Date(2016,0,5):d};
function ageOf(st){const b=birthOf(st),n=new Date();return n.getFullYear()-b.getFullYear()-((n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))?1:0)}

/* ================= IA (via le serveur) ================= */
async function callAI(kind,payload){
 const {data}=await sb.auth.getSession();const tok=data.session&&data.session.access_token;
 const r=await fetch((CFG&&CFG.aiEndpoint)||'/api/ai',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok},body:JSON.stringify({kind,payload})});
 let j={};try{j=await r.json()}catch(e){}
 if(!r.ok){const err=new Error(j.error||('HTTP '+r.status));err.code=j.code||String(r.status);throw err}
 return j;
}
const aiMsg=e=>e&&e.code==='429'?'L\'IA a atteint sa limite pour aujourd\'hui. Réessaie demain.':e&&e.code==='not_configured'?'L\'IA n\'est pas encore activée sur le serveur.':e&&e.code==='auth'?'Ta connexion a expiré : reconnecte-toi.':'L\'IA n\'a pas pu répondre. Vérifie la connexion et réessaie.';
const AI={pool:[],busy:false,off:false,
 async fetch(reqs){
  if(this.off||this.busy||!reqs.length)return;this.busy=true;
  try{const j=await callAI('questions',{reqs:reqs.slice(0,16),recent:S().aiStems.slice(-40)});
   for(const o of (j.questions||[])){if(!o||typeof o.q!=='string'||!Array.isArray(o.choices)||o.choices.length!==4||!DM[o.d])continue;const ch=o.choices.map(c=>String(c).slice(0,160));if(new Set(ch).size!==4)continue;this.pool.push({d:o.d,lvl:clamp(Math.round(Number(o.lvl)||3),1,10),type:'mcq',q:String(o.q).slice(0,400),choices:ch,expl:String(o.expl||'').slice(0,500),src:'ia'})}
  }catch(e){if(e.code==='not_configured')this.off=true;console.warn('IA',e)}
  this.busy=false;
 },
 take(d,lvl){let best=-1,bd=9;this.pool.forEach((q,i)=>{if(q.d===d&&Math.abs(q.lvl-lvl)<bd){bd=Math.abs(q.lvl-lvl);best=i}});if(best<0||bd>2)return null;return this.pool.splice(best,1)[0]},
};

/* ================= Choix des questions ================= */
function bankQuestion(d,lvl){
 const list=BANK[d]||[];if(!list.length)return null;
 const seen=new Set(S().seen);
 const cands=list.map((x,i)=>({x,id:d+':'+i,dist:Math.abs(x[0]-lvl)})).sort((a,b)=>(seen.has(a.id)-seen.has(b.id))||(a.dist-b.dist)||Math.random()-.5);
 const c=cands[0];if(!c)return null;
 return{d,lvl:c.x[0],type:'mcq',q:c.x[1],choices:c.x[2],expl:c.x[3],src:'bank',id:c.id};
}
function makeQuestion(d,L){
 const lvl=clamp(Math.round(L+(Math.random()*1.4-.5)),1,10);
 if(PROCEDURAL.has(d))return GEN[d](lvl);
 const ia=AI.take(d,lvl);if(ia)return ia;
 if(GEN[d]&&(!(d in MIXED)||Math.random()>MIXED[d]))return GEN[d](lvl);
 const b=bankQuestion(d,lvl);if(b&&(Math.abs(b.lvl-lvl)<=2||!GEN[d]))return b;
 return GEN[d]?GEN[d](lvl):b;
}
function planMission(n){
 const base=['calcul','maths','logique','memoire'];
 const others=shuffle(['francais','anglais','sciences','histgeo','culture','argent','code']);
 const picks=[...base,...others];
 const weak=DOMAINS.filter(d=>d.k!=='defi').sort((a,b)=>S().levels[a.k]-S().levels[b.k]).map(d=>d.k);
 let i=0;while(picks.length<n){picks.push(weak[i%3]);i++}
 return shuffle(picks.slice(0,n));
}

/* ================= Session de jeu ================= */
const Session={cur:null};
function startSession(kind,opts={}){
 let plan;
 if(kind==='mission')plan=planMission(S().missionLen||12);
 else if(kind==='bilan'){plan=[];DOMAINS.filter(d=>d.k!=='defi').forEach(d=>{plan.push(d.k,d.k)});plan=shuffle(plan)}
 else if(kind==='libre')plan=Array(8).fill(opts.d);
 else if(kind==='sprint')plan=[];
 if(kind==='bilan'&&!S().placementDone){DOMAINS.forEach(d=>{if(d.k!=='defi')S().levels[d.k]=3.5})}
 Session.cur={id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),kind,plan,i:0,answers:[],start:Date.now(),xp:0,before:Object.assign({},S().levels),q:null,qStart:0,defi:null};Game.start(kind,plan.length);
 const aiDomains=plan.filter(d=>!PROCEDURAL.has(d));
 if(aiDomains.length&&kind!=='sprint')AI.fetch(aiDomains.map(d=>({d,lvl:clamp(Math.round(S().levels[d]+.3),1,10)})));
 if(kind==='sprint'){startSprint();return}
 nextQuestion();
}
function nextQuestion(){
 const c=Session.cur;if(c.i>=c.plan.length){if(c.kind==='mission'&&!AI.off){showDefi();return}finishSession();return}
 const d=c.plan[c.i];c.q=makeQuestion(d,S().levels[d]);
 if(c.q.type==='mcq'){const right=c.q.choices[0];const ord=c.q.noShuffle?c.q.choices.slice():shuffle(c.q.choices);c.q.view=ord;c.q.rightIdx=ord.indexOf(right)}
 c.qStart=Date.now();view='quiz';render();
}
function updateLevel(d,qlvl,ok,fast){
 const big=Session.cur&&Session.cur.kind==='bilan';const L=S().levels[d];const gap=qlvl-L;let delta;
 if(ok)delta=(big?.75:.22)+Math.max(0,gap)*.12+(fast?.05:0);else delta=-((big?.6:.28)+Math.max(0,-gap)*.12);
 S().levels[d]=clamp(L+delta,1,10);
}
function answer(given){
 const c=Session.cur,q=c.q;if(q.done)return;q.done=true;
 const ms=Date.now()-c.qStart;let ok,givenTxt,rightTxt;
 if(q.type==='mcq'){ok=given===q.rightIdx;givenTxt=q.view[given]??'';rightTxt=q.view[q.rightIdx]}
 else if(q.type==='memory'){const g=String(given).replace(/\D/g,'');ok=g===q.answer;givenTxt=g;rightTxt=q.answer}
 else{const g=parseFloat(String(given).replace(/\s/g,'').replace(',','.'));ok=Number.isFinite(g)&&Math.abs(g-q.answer)<1e-6*Math.max(1,Math.abs(q.answer));givenTxt=String(given).trim();rightTxt=fmt(q.answer)}
 const fast=q.timed&&ms<8000;Game.onAnswer(ok,q);
 updateLevel(q.d,q.lvl,ok,fast);
 const gain=ok?Math.round((10+q.lvl*2+(fast?5:0))*Game.mult()):1;c.xp+=gain;
 const st=S();st.total++;if(ok)st.correct++;st.counts[q.d]=(st.counts[q.d]||0)+1;
 if(q.id){st.seen=st.seen.filter(x=>x!==q.id);st.seen.push(q.id)}
 if(q.src==='ia'){st.aiStems.push(q.q.slice(0,90));st.aiStems=st.aiStems.slice(-60)}
 c.answers.push({d:q.d,lvl:q.lvl,ok,ms,q:(q.code?q.q+' '+q.code.replace(/\n/g,' ; '):q.q).slice(0,220),given:String(givenTxt).slice(0,80),right:String(rightTxt).slice(0,80),src:q.src});
 q.result={ok,givenIdx:given,rightTxt,fast,gain};
 Store.save();
 renderQuiz();
}
function finishSession(){
 const c=Session.cur;const st=S();
 const ok=c.answers.filter(a=>a.ok).length;
 const today=dayKey();
 if(c.kind==='mission'||c.kind==='bilan'){
  if(st.lastDay!==today){st.streak=(st.lastDay===dayKey(addDays(new Date(),-1)))?st.streak+1:1;st.lastDay=today;st.bestStreak=Math.max(st.bestStreak||0,st.streak);c.xp+=20+st.streak*5}
 }
 if(c.kind==='bilan')st.placementDone=true;
 if(c.kind==='sprint')st.sprintBest=Math.max(st.sprintBest||0,ok);
 const oldXp=st.xp;st.xp+=c.xp;
 const sess={id:c.id,ts:Date.now(),day:today,kind:c.kind,n:c.answers.length,ok,ms:Date.now()-c.start,xp:c.xp,global:+globalLevel().toFixed(3),levels:Object.fromEntries(Object.entries(st.levels).map(([k,v])=>[k,+v.toFixed(3)])),answers:c.answers};
 if(c.defi)sess.defi=c.defi;
 Store.addSession(sess);Store.save();
 Game.end(sess,oldXp,st.xp);c.done=sess;view='results';render();
}

/* ================= Rendu ================= */
let view='home';
const app=document.getElementById('app');
function route(){if(!user){view='auth';render();return}if(Session.cur&&Session.cur.done)Session.cur=null;const hsh=location.hash.replace('#','');if(hsh==='parent'){view='parent';parentOpen=!S().parentCode}else if(!Session.cur)view='home';render()}
window.addEventListener('hashchange',route);
let parentOpen=false;
let lastAnalysis='',analysing=false;
function busyUI(){const a=document.activeElement;return analysing||(a&&/^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName))}

function logo(){return h('a',{class:'logo',href:'#eleve',style:'color:inherit;text-decoration:none'},(()=>{const g=s('svg',{viewBox:'0 0 40 40','aria-hidden':'true'});g.append(s('ellipse',{cx:20,cy:20,rx:17,ry:7,fill:'none',stroke:'#7CC8FF','stroke-width':2,transform:'rotate(-25 20 20)'}),s('circle',{cx:20,cy:20,r:7,fill:'#FFC145'}),s('circle',{cx:34,cy:13,r:3,fill:'#FF6F59'}));return g})(),'Orbite')}

function render(){
 app.replaceChildren();
 if(view==='auth')return renderAuth();
 if(view==='loading')return app.append(h('div',{class:'card center',style:'margin:20vh auto 0;max-width:360px'},logo(),h('p',{class:'muted',style:'margin-top:10px'},'Chargement…')));
 if(view==='quiz'&&Session.cur)return renderQuiz();
 if(view==='defi')return renderDefi();
 if(view==='results')return renderResults();
 if(view==='parent')return renderParent();
 if(view==='sprint')return renderSprint();
 renderHome();
}

function storageNote(){return syncOK?h('span',{class:'chip mint',id:'sync',title:'Tes progrès sont enregistrés en ligne.'},'● Enregistré'):h('span',{class:'chip coral',id:'sync',title:'Pas de réseau : tes résultats seront envoyés dès que la connexion revient.'},'● Hors ligne')}
function logoutBtn(){return h('button',{class:'navlink',style:'background:none;cursor:pointer',onclick:async()=>{Session.cur=null;await sb.auth.signOut()}},'Déconnexion')}

/* ---------- Connexion ---------- */
let authMode='login';
const toEmail=v=>{v=v.trim().toLowerCase();if(v.includes('@'))return v;return v.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9._-]/g,'')+'@eleve.orbite.app'};
function renderAuth(){
 const signup=authMode==='signup';
 const idI=h('input',{id:'au-id',autocomplete:'username',autocapitalize:'none',spellcheck:'false',placeholder:'ex. adam.b'});
 const pwI=h('input',{id:'au-pw',type:'password',autocomplete:signup?'new-password':'current-password',placeholder:'6 caractères minimum'});
 const nmI=signup?h('input',{id:'au-name',autocomplete:'given-name',placeholder:'Son prénom'}):null;
 const msg=h('p',{class:'down',style:'min-height:1.4em'});
 const btn=h('button',{class:'btn',type:'submit'},signup?'Créer le compte':'Se connecter');
 const form=h('form',{class:'grid',style:'gap:14px;margin-top:16px'},
  signup?h('div',{class:'field'},h('label',{for:'au-name'},'Prénom de l\'élève'),nmI):null,
  h('div',{class:'field'},h('label',{for:'au-id'},'Identifiant'),idI),
  h('div',{class:'field'},h('label',{for:'au-pw'},'Mot de passe'),pwI),
  msg,h('div',{class:'row'},btn));
 form.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='';
  const id=idI.value.trim(),pw=pwI.value;
  if(id.replace(/[^a-z0-9]/gi,'').length<3){msg.textContent='L\'identifiant doit contenir au moins 3 lettres ou chiffres.';return}
  if(pw.length<6){msg.textContent='Le mot de passe doit faire au moins 6 caractères.';return}
  btn.disabled=true;btn.textContent='Un instant…';
  try{
   if(signup){const {data,error}=await sb.auth.signUp({email:toEmail(id),password:pw});if(error)throw error;
    if(!data.session){msg.textContent='Compte créé, mais Supabase demande une confirmation par e-mail. Désactive « Confirm email » dans Supabase puis connecte-toi.';btn.disabled=false;btn.textContent='Créer le compte';return}
    await onLogin(data.session.user,{name:(nmI.value||'').trim().slice(0,30)});
   }else{const {data,error}=await sb.auth.signInWithPassword({email:toEmail(id),password:pw});if(error)throw error;await onLogin(data.session.user)}
  }catch(err){const m=String(err&&err.message||'');msg.textContent=/invalid login/i.test(m)?'Identifiant ou mot de passe incorrect.':/already registered|already been registered/i.test(m)?'Cet identifiant existe déjà : connecte-toi.':/fetch|network/i.test(m)?'Pas de connexion internet.':'Erreur : '+m;btn.disabled=false;btn.textContent=signup?'Créer le compte':'Se connecter'}
 });
 app.append(h('div',{style:'max-width:440px;width:100%;margin:8vh auto 0;display:flex;flex-direction:column;gap:18px'},
  logo(),
  h('div',{class:'card pop'},h('h1',{style:'font-size:1.8rem'},signup?'Créer un compte élève':'Connexion'),h('p',{class:'muted',style:'margin-top:6px'},signup?'Un compte par élève. Ses progrès sont enregistrés et suivis sur tous ses appareils.':'Retrouve ta mission du jour sur n\'importe quel appareil.'),form),
  h('p',{class:'center muted'},signup?'Déjà un compte ? ':'Pas encore de compte ? ',h('a',{href:'#',style:'color:var(--gold);font-weight:700',onclick:e=>{e.preventDefault();authMode=signup?'login':'signup';render()}},signup?'Se connecter':'Créer un compte'))));
 setTimeout(()=>(nmI||idI).focus(),30);
}
async function onLogin(u,extra){
 user=u;view='loading';render();
 try{await Store.load()}catch(e){console.warn(e);Store.S=normalize(lsGet('orbite.state.'+u.id));Store.sessions=lsGet(pendKey())||[];Store.ready=true;setSync(false)}
 if(extra&&extra.name&&!S().name){S().name=extra.name;Store.save()}
 route();
}
async function boot(){
 view='loading';render();
 if(window.ORBITE_CONFIG)CFG=window.ORBITE_CONFIG;else{try{const r=await fetch('/api/config');CFG=await r.json()}catch(e){CFG=null}}
 if(!CFG||!CFG.supabaseUrl||!window.supabase){app.replaceChildren(h('div',{class:'card',style:'max-width:520px;margin:10vh auto 0'},logo(),h('h2',{style:'margin-top:14px'},'Configuration incomplète'),h('p',{class:'muted',style:'margin-top:6px'},'Le serveur n\'a pas encore les clés Supabase (SUPABASE_URL et SUPABASE_ANON_KEY), ou la connexion internet est coupée.')));return}
 if(!CFG.ai)AI.off=true;
 sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
 sb.auth.onAuthStateChange(ev=>{if(ev==='SIGNED_OUT'){user=null;Session.cur=null;view='auth';render()}});
 const {data}=await sb.auth.getSession();
 if(data.session)await onLogin(data.session.user);else{view='auth';render()}
}
document.addEventListener('visibilitychange',async()=>{if(document.visibilityState!=='visible'||!user||Session.cur||busyUI())return;try{await Store.load();if(view==='home'||view==='parent')render()}catch(e){}});

function constellation(){
 const W=520,H=400,cx=W/2,cy=H/2+4,R=150;
 const svgEl=s('svg',{class:'const',viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'Constellation des niveaux par domaine'});
 const defs=s('defs');DOMAINS.forEach(d=>{const g=s('radialGradient',{id:'g-'+d.k});g.append(s('stop',{offset:'0%','stop-color':d.c,'stop-opacity':.9}),s('stop',{offset:'100%','stop-color':d.c,'stop-opacity':0}));defs.append(g)});svgEl.append(defs);
 const pts=DOMAINS.map((d,i)=>{const a=-Math.PI/2+i*2*Math.PI/DOMAINS.length;const L=S().levels[d.k];const rr=R*(.55+.45*(L/10));return{d,L,x:cx+rr*Math.cos(a),y:cy+rr*Math.sin(a)*.86,a}});
 const path=pts.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' ')+'Z';
 svgEl.append(s('path',{d:path,fill:'rgba(124,200,255,.07)',stroke:'rgba(124,200,255,.35)','stroke-width':1.2}));
 // anneau 6e
 svgEl.append(s('ellipse',{cx,cy,rx:R*(.55+.45*.3),ry:R*(.55+.45*.3)*.86,fill:'none',stroke:'rgba(255,255,255,.12)','stroke-dasharray':'3 5'}));
 svgEl.append(s('text',{x:cx,y:cy-R*(.55+.135)*.86+16,'text-anchor':'middle',opacity:.7},'cercle = 6e'));
 const gl=globalLevel();
 svgEl.append(s('text',{x:cx,y:cy-6,'text-anchor':'middle',style:'font-family:Fredoka,sans-serif;font-size:30px;font-weight:700;fill:#EEF1FF'},gradeOf(gl)));
 svgEl.append(s('text',{x:cx,y:cy+14,'text-anchor':'middle'},'niveau global '+gl.toFixed(1)+' / 10'));
 pts.forEach(p=>{
  const r=5+p.L*1.5;const isDefi=p.d.k==='defi';
  const g=s('g',{class:'star',tabindex:isDefi?null:0,role:isDefi?null:'button','aria-label':`${p.d.n} : niveau ${p.L.toFixed(1)}, ${gradeOf(p.L)}${isDefi?'':'. S\'entraîner.'}`});
  g.append(s('circle',{cx:p.x,cy:p.y,r:r*2.6,fill:`url(#g-${p.d.k})`,opacity:.55}),s('circle',{class:'core',cx:p.x,cy:p.y,r,fill:p.d.c}));
  const lx=cx+(R+58)*Math.cos(p.a),ly=cy+(R+44)*Math.sin(p.a)*.86;
  const anchor=Math.abs(Math.cos(p.a))<.3?'middle':(Math.cos(p.a)>0?'start':'end');
  const lxx=Math.abs(Math.cos(p.a))<.3?lx:p.x+(Math.cos(p.a)>0?r+8:-r-8);
  const lyy=Math.abs(Math.cos(p.a))<.3?(Math.sin(p.a)<0?p.y-r-18:p.y+r+16):p.y-2;
  g.append(s('text',{x:lxx,y:lyy,'text-anchor':anchor},p.d.n.replace(' & entreprise','').replace(' & problèmes','').replace(' & expression','').replace('Pensée algorithmique','Algorithmes')));
  g.append(s('text',{class:'v',x:lxx,y:lyy+12,'text-anchor':anchor},gradeOf(p.L)));
  if(!isDefi){const go=()=>startSession('libre',{d:p.d.k});g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})}
  svgEl.append(g);
 });
 return svgEl;
}

function renderHome(){
 const st=S();const today=dayKey();const done=Store.sessions.some(x=>x.day===today&&x.kind==='mission');
 const rk=rankOf(st.xp);const pct=rk.next?((st.xp-rk.min)/(rk.next[0]-rk.min))*100:100;
 const name=st.name||'champion';
 app.append(h('div',{class:'top'},logo(),h('span',{class:'spacer'}),Game.muteBtn(),storageNote(),h('a',{class:'navlink',href:'#parent'},'Espace parent'),logoutBtn()));
 const leftCol=h('div',{class:'grid'},
  h('div',{},h('p',{class:'label'},new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})),h('h1',{},`Salut ${name} !`),h('p',{class:'muted',style:'margin-top:6px;max-width:46ch'},'Chaque jour, une mission courte. Les questions s\'adaptent à toi : plus tu réussis, plus elles deviennent difficiles.')),
  !st.placementDone?h('div',{class:'card mission pop'},
    h('p',{class:'label',style:'color:var(--gold)'},'Première étape'),
    h('p',{class:'big'},'Bilan de départ'),
    h('p',{class:'muted'},'22 questions dans 11 domaines pour situer ton niveau réel. Environ 20 minutes. Prends ton temps, c\'est normal de ne pas tout savoir.'),
    h('div',{class:'row',style:'margin-top:14px'},h('button',{class:'btn',onclick:()=>startSession('bilan')},'Commencer le bilan')))
  :h('div',{class:'card mission pop'},
    h('p',{class:'label',style:'color:var(--gold)'},done?'Mission accomplie aujourd\'hui ✓':'Mission du jour'),
    h('p',{class:'big'},done?'Bravo ! Encore une ?':`${st.missionLen} questions + 1 défi`),
    h('p',{class:'muted'},done?'Ta série est sauvée. Tu peux refaire une mission ou t\'entraîner sur une étoile.':'Environ 15 minutes. Calcul, logique, mémoire, langues, sciences, culture, argent et un défi de réflexion corrigé par l\'IA.'),
    h('div',{class:'row',style:'margin-top:14px'},h('button',{class:'btn',onclick:()=>startSession('mission')},done?'Nouvelle mission':'Lancer la mission'),h('button',{class:'btn ghost',onclick:()=>startSession('sprint')},'Sprint 60 s'))),
  h('div',{class:'card'},
   h('div',{class:'statline'},
    h('div',{class:'stat'},h('div',{class:'v',style:'color:var(--coral)'},String(st.streak||0)),h('div',{class:'k'},'jours d\'affilée')),
    h('div',{class:'stat'},h('div',{class:'v',style:'color:var(--gold)'},fmt(st.xp)),h('div',{class:'k'},'points XP')),
    h('div',{class:'stat'},h('div',{class:'v'},st.total?Math.round(st.correct/st.total*100)+' %':'—'),h('div',{class:'k'},'de bonnes réponses')),
    h('div',{class:'stat'},h('div',{class:'v',style:'color:var(--sky)'},String(st.sprintBest||0)),h('div',{class:'k'},'record sprint'))),
   h('div',{style:'margin-top:14px'},h('div',{class:'row',style:'justify-content:space-between;margin-bottom:6px'},h('b',{style:'font-family:var(--f-display)'},'Rang : '+rk.name),h('span',{class:'muted mono',style:'font-size:.85rem'},rk.next?`${fmt(rk.next[0]-st.xp)} XP avant ${rk.next[1]}`:'Rang maximal')),h('div',{class:'xpbar'},h('i',{style:`width:${clamp(pct,2,100)}%`})))),
 );
 const right=h('div',{class:'card'},h('div',{class:'row',style:'justify-content:space-between'},h('h3',{},'Ta constellation'),h('span',{class:'muted',style:'font-size:.85rem'},'Touche une étoile pour t\'entraîner')),constellation());
 app.append(h('div',{class:'hero'},leftCol,right));
 app.append(Game.homeCard());
}

/* ---------- Écran question ---------- */
function renderQuiz(){
 app.replaceChildren();
 const c=Session.cur,q=c.q;const d=DM[q.d];
 const prog=h('div',{class:'prog'},c.plan.map((_,i)=>h('i',{class:i<c.answers.length?(c.answers[i].ok?'ok':'ko'):(i===c.i?'cur':'')})));
 const head=h('div',{class:'row'},h('button',{class:'btn ghost small',onclick:()=>{if(c.answers.length){finishSession()}else{Session.cur=null;view='home';render()}}},c.answers.length?'Terminer':'Quitter'),h('span',{class:'spacer'}),h('span',{class:'dchip'},h('i',{class:'dot',style:`background:${d.c}`}),d.n),h('span',{class:'chip'},'Niveau '+gradeOf(q.lvl)),q.src==='ia'?h('span',{class:'chip',title:'Question créée par l\'IA pour ton niveau'},'IA'):null);
 const card=h('div',{class:'card qcard pop'});
 card.append(h('p',{class:'label',style:'margin-bottom:10px'},`Question ${c.i+1} / ${c.plan.length}`));
 if(q.type==='memory'&&!q.result)return renderMemory(head,prog,card);
 card.append(h('p',{class:'qtext'},q.q));
 if(q.code)card.append(h('pre',{class:'code',style:'margin-top:14px'},q.code));
 const body=h('div',{style:'margin-top:18px;display:flex;flex-direction:column;gap:14px'});
 if(q.type==='mcq'){
  const box=h('div',{class:'choices'});
  q.view.forEach((t,i)=>{const cls=['choice'];if(q.result){if(i===q.rightIdx)cls.push('right');else if(i===q.result.givenIdx)cls.push('wrong')}
   box.append(h('button',{class:cls.join(' '),disabled:!!q.result,onclick:()=>answer(i)},h('span',{class:'key'},String(i+1)),h('span',{},t)))});
  body.append(box);
 }else{
  const inp=h('input',{class:'numin',id:'ans',inputmode:q.type==='memory'?'numeric':'decimal',autocomplete:'off',placeholder:'Ta réponse','aria-label':'Ta réponse',disabled:!!q.result});
  if(q.result)inp.value=c.answers[c.answers.length-1].given;
  const go=()=>{if(inp.value.trim())answer(inp.value)};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go()}});
  body.append(h('div',{class:'numrow'},inp,q.unit?h('span',{class:'unit'},q.unit):null,!q.result?h('button',{class:'btn',onclick:go},'Valider'):null));
  if(!q.result)setTimeout(()=>inp.focus(),30);
 }
 if(q.result){
  const r=q.result;
  body.append(h('div',{class:'fb pop '+(r.ok?'ok':'ko')},h('b',{},r.ok?(r.fast?'Excellent, et rapide ! ':'Bonne réponse ! ')+`+${r.gain} XP`:'Pas tout à fait. Réponse : '+r.rightTxt),q.expl?h('p',{},q.expl):null));
  const nb=h('button',{class:'btn mint',id:'next',onclick:()=>{c.i++;nextQuestion()}},c.i+1>=c.plan.length?'Voir la suite':'Question suivante');
  body.append(h('div',{class:'row'},nb,h('span',{class:'faint',style:'font-size:.85rem'},'Entrée pour continuer')));
  setTimeout(()=>nb.focus(),30);
 }
 card.append(body);
 app.append(h('div',{class:'quiz'},head,Game.hud(),prog,card));
}
document.addEventListener('keydown',e=>{
 if(view!=='quiz'||!Session.cur||!Session.cur.q)return;const q=Session.cur.q;
 if(!q.result&&q.type==='mcq'&&/^[1-4]$/.test(e.key)){answer(+e.key-1)}
});
function renderMemory(head,prog,card){
 const c=Session.cur,q=c.q;
 card.append(h('p',{class:'qtext'},q.q));
 const shown=h('div',{class:'memdigits'},q.digits.split('').join(' '));
 const bar=h('i',{});const tm=h('div',{class:'timer'},bar);
 card.append(h('div',{style:'margin-top:16px;display:flex;flex-direction:column;gap:10px'},shown,tm));
 app.append(h('div',{class:'quiz'},head,Game.hud(),prog,card));
 bar.animate([{width:'100%'},{width:'0%'}],{duration:q.show,easing:'linear',fill:'forwards'});
 setTimeout(()=>{if(Session.cur!==c||c.q!==q)return;q.hidden=true;q.type='memtype';renderMemType()},q.show);
}
function renderMemType(){
 const c=Session.cur,q=c.q;q.type='memory';
 app.replaceChildren();
 // réutilise le rendu standard avec un champ texte
 const fake=Object.assign({},q);
 q.type='memory';q.result=null;
 const d=DM[q.d];
 const head=h('div',{class:'row'},h('span',{class:'spacer'}),h('span',{class:'dchip'},h('i',{class:'dot',style:`background:${d.c}`}),d.n),h('span',{class:'chip'},'Niveau '+gradeOf(q.lvl)));
 const prog=h('div',{class:'prog'},c.plan.map((_,i)=>h('i',{class:i<c.answers.length?(c.answers[i].ok?'ok':'ko'):(i===c.i?'cur':'')})));
 const inp=h('input',{class:'numin',id:'ans',inputmode:'numeric',autocomplete:'off',placeholder:q.back?'À l\'envers…':'Dans l\'ordre…','aria-label':'Les chiffres'});
 const go=()=>{if(inp.value.trim()){q.type='memory';answer(inp.value)}};
 inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go()}});
 const card=h('div',{class:'card qcard pop'},h('p',{class:'label',style:'margin-bottom:10px'},`Question ${c.i+1} / ${c.plan.length}`),h('p',{class:'qtext'},q.back?'Écris les chiffres à l\'envers.':'Écris les chiffres dans l\'ordre.'),h('div',{class:'numrow',style:'margin-top:18px'},inp,h('button',{class:'btn',onclick:go},'Valider')));
 app.append(h('div',{class:'quiz'},head,Game.hud(),prog,card));
 setTimeout(()=>inp.focus(),30);
 void fake;
}
// le rendu après réponse mémoire passe par renderQuiz (q.result défini)

/* ---------- Sprint calcul ---------- */
let sprintTimer=null;
function startSprint(){const c=Session.cur;c.plan=[];c.end=Date.now()+60000;view='sprint';sprintNext();clearInterval(sprintTimer);sprintTimer=setInterval(()=>{const left=Math.max(0,c.end-Date.now());const t=document.getElementById('sptime');if(t)t.textContent=Math.ceil(left/1000)+' s';const b=document.getElementById('spbar');if(b)b.style.width=(left/600)+'%';if(left<=0){clearInterval(sprintTimer);finishSession()}},200)}
function sprintNext(){const c=Session.cur;const L=S().levels.calcul;c.q=GEN.calcul(clamp(Math.round(L-1+Math.random()*1.5),1,10));c.qStart=Date.now();renderSprint()}
function renderSprint(){
 app.replaceChildren();const c=Session.cur;if(!c)return renderHome();const q=c.q;
 const ok=c.answers.filter(a=>a.ok).length;
 const inp=h('input',{class:'numin',id:'spin',inputmode:'decimal',autocomplete:'off','aria-label':'Ta réponse'});
 const flash=h('p',{class:'muted',style:'min-height:1.5em'},c.last||'');
 inp.addEventListener('keydown',e=>{if(e.key!=='Enter'||!inp.value.trim())return;e.preventDefault();
  const g=parseFloat(inp.value.replace(/\s/g,'').replace(',','.'));const good=Number.isFinite(g)&&Math.abs(g-q.answer)<1e-6*Math.max(1,Math.abs(q.answer));
  Game.sfx(good?'ok':'ko');if(good)confetti(10);const ms=Date.now()-c.qStart;c.answers.push({d:'calcul',lvl:q.lvl,ok:good,ms,q:q.q,given:inp.value.slice(0,20),right:fmt(q.answer),src:'gen'});c.plan.push('calcul');
  S().total++;if(good)S().correct++;c.xp+=good?4+q.lvl:0;
  S().levels.calcul=clamp(S().levels.calcul+(good?.06:-.08),1,10);
  c.last=good?'✓ Juste':`✗ ${q.q.replace('Calcule : ','')} = ${fmt(q.answer)}`;sprintNext()});
 app.append(h('div',{class:'quiz'},
  h('div',{class:'row'},h('h2',{},'Sprint calcul mental'),h('span',{class:'spacer'}),h('span',{class:'chip gold mono',id:'sptime'},Math.ceil(Math.max(0,c.end-Date.now())/1000)+' s')),
  h('div',{class:'timer'},h('i',{id:'spbar',style:`width:${Math.max(0,c.end-Date.now())/600}%;background:var(--gold)`})),
  h('div',{class:'card qcard center'},h('p',{class:'label'},`Bonnes réponses : ${ok}   ·   record : ${S().sprintBest||0}`),h('p',{class:'memdigits',style:'color:var(--ink);letter-spacing:.02em'},q.q.replace('Calcule : ','')),h('div',{class:'numrow',style:'justify-content:center'},inp),flash,h('p',{class:'faint',style:'font-size:.85rem'},'Tape ta réponse puis Entrée. Le plus possible en 60 secondes !'))));
 setTimeout(()=>inp.focus(),10);
}

/* ---------- Défi IA ---------- */
function showDefi(){const c=Session.cur;const idx=Math.floor(Date.now()/86400000)%DEFIS.length;c.defi={prompt:DEFIS[(idx+Store.sessions.filter(x=>x.defi).length)%DEFIS.length],reponse:'',note:null};view='defi';render()}
function renderDefi(){
 const c=Session.cur,df=c.defi;
 const ta=h('textarea',{id:'defi-txt',placeholder:'Écris ta réponse ici. Prends le temps d\'expliquer ton raisonnement…'});ta.value=df.reponse||'';
 const out=h('div',{class:'ai-out',hidden:true});
 const send=h('button',{class:'btn'},'Envoyer au correcteur');
 const skip=h('button',{class:'btn ghost',onclick:()=>{c.defi=null;finishSession()}},'Passer le défi');
 const status=h('p',{class:'muted'});
 send.addEventListener('click',async()=>{
  const txt=ta.value.trim();if(txt.length<20){status.textContent='Écris au moins deux ou trois phrases.';return}
  df.reponse=txt.slice(0,3000);send.disabled=true;skip.disabled=true;ta.disabled=true;status.textContent='Le correcteur lit ta réponse…';
  const lvl=S().levels.defi;
  try{const r=await callAI('grade',{prompt:df.prompt,reponse:df.reponse,niveau:gradeOf(lvl)});
   const note=clamp(Math.round(Number(r.note)||0),0,10);df.note=note;df.bravo=String(r.bravo||'').slice(0,400);df.ameliorer=String(r.ameliorer||'').slice(0,400);df.relance=String(r.relance||'').slice(0,300);df.ortho=String(r.orthographe||'').slice(0,400);
   S().levels.defi=clamp(lvl+(note-6)*.12,1,10);c.xp+=note*5;S().counts.defi=(S().counts.defi||0)+1;
   status.textContent='';out.hidden=false;out.replaceChildren(h('p',{style:'font-family:var(--f-display);font-size:1.6rem;font-weight:700;color:var(--gold)'},note+' / 10'),h('p',{},h('b',{},'Bravo : '),df.bravo),h('p',{style:'margin-top:8px'},h('b',{},'Pour progresser : '),df.ameliorer),df.ortho?h('p',{style:'margin-top:8px'},h('b',{},'Orthographe : '),df.ortho):null,h('p',{style:'margin-top:8px'},h('b',{},'Pour aller plus loin : '),df.relance));
   send.replaceWith(h('button',{class:'btn mint',onclick:()=>finishSession()},'Voir mes résultats'));skip.remove();
  }catch(e){status.textContent=aiMsg(e);send.disabled=false;skip.disabled=false;ta.disabled=false;if(e&&e.code==='not_configured')AI.off=true}
 });
 app.append(h('div',{class:'quiz'},
  h('div',{class:'row'},h('span',{class:'dchip'},h('i',{class:'dot',style:`background:${DM.defi.c}`}),'Défi de réflexion'),h('span',{class:'spacer'}),h('span',{class:'chip'},'Niveau '+gradeOf(S().levels.defi))),
  h('div',{class:'card qcard pop'},h('p',{class:'label',style:'margin-bottom:10px'},'Dernière étape de la mission'),h('p',{class:'qtext'},df.prompt),h('div',{style:'margin-top:16px;display:flex;flex-direction:column;gap:12px'},ta,status,h('div',{class:'row'},send,skip),out))));
}

/* ---------- Résultats ---------- */
function renderResults(){
 const c=Session.cur;const sess=c.done;const st=S();
 const changed=Object.keys(st.levels).filter(k=>Math.abs(st.levels[k]-c.before[k])>.001);
 const pct=sess.n?Math.round(sess.ok/sess.n*100):0;
 const msg=pct>=85?'Performance de haut niveau.':pct>=65?'Très bien. Les questions vont monter d\'un cran.':pct>=45?'Bon travail. Les erreurs, c\'est là qu\'on apprend le plus.':'Session difficile : le niveau va s\'ajuster. Relis bien les explications.';
 app.append(h('div',{class:'quiz'},
  Game.resultBanner(sess),
  h('div',{class:'card pop center',style:'padding:28px'},h('p',{class:'label'},({mission:'Mission terminée',bilan:'Bilan terminé',libre:'Entraînement terminé',sprint:'Sprint terminé'})[sess.kind]),h('p',{style:'font-family:var(--f-display);font-size:3rem;font-weight:700;line-height:1.1;margin-top:6px'},`${sess.ok} / ${sess.n}`),h('p',{class:'muted'},msg),
   h('div',{class:'row',style:'justify-content:center;margin-top:14px'},h('span',{class:'chip gold'},`+${sess.xp} XP`),(sess.kind==='mission'||sess.kind==='bilan')?h('span',{class:'chip coral'},`Série : ${st.streak} jour${st.streak>1?'s':''}`):null,sess.defi&&sess.defi.note!=null?h('span',{class:'chip'},`Défi : ${sess.defi.note}/10`):null)),
  changed.length?h('div',{class:'card'},h('h3',{style:'margin-bottom:8px'},sess.kind==='bilan'?'Ton niveau de départ':'Évolution de tes niveaux'),...changed.map(k=>{const dlt=st.levels[k]-c.before[k];return h('div',{class:'lvlrow'},h('span',{class:'dchip'},h('i',{class:'dot',style:`background:${DM[k].c}`}),DM[k].n),h('span',{class:'mono'},gradeOf(st.levels[k])+'  ',h('span',{class:dlt>=0?'up':'down'},(dlt>=0?'▲ ':'▼ ')+Math.abs(dlt).toFixed(2))))})):null,
  h('div',{class:'row',style:'justify-content:center'},h('button',{class:'btn',onclick:()=>{Session.cur=null;view='home';location.hash='eleve';render()}},'Retour à la base'))));
}

/* ---------- Espace parent ---------- */
function renderParent(){
 const st=S();
 app.append(h('div',{class:'top'},logo(),h('span',{class:'chip'},'Espace parent'),h('span',{class:'spacer'}),storageNote(),h('button',{class:'navlink',style:'background:none;cursor:pointer',onclick:async e=>{e.target.textContent='Actualisation…';try{await Store.load()}catch(err){}render()}},'Actualiser'),h('a',{class:'navlink',href:'#eleve'},'← Espace élève'),logoutBtn()));
 if(!user)return renderAuth();
 if(st.parentCode&&!parentOpen){
  const inp=h('input',{id:'pcode',type:'password',inputmode:'numeric',autocomplete:'off',style:'max-width:200px'});
  const err=h('p',{class:'down',hidden:true},'Code incorrect.');
  const go=()=>{if(inp.value===st.parentCode){parentOpen=true;render()}else err.hidden=false};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  app.append(h('div',{class:'card',style:'max-width:420px'},h('h2',{},'Code parent'),h('div',{class:'field',style:'margin-top:12px'},h('label',{for:'pcode'},'Entre le code'),inp),err,h('div',{class:'row',style:'margin-top:12px'},h('button',{class:'btn',onclick:go},'Ouvrir'))));
  setTimeout(()=>inp.focus(),30);return;
 }
 const sess=Store.sessions.slice().sort((a,b)=>a.ts-b.ts);
 const now=new Date();const BIRTH=birthOf(st);const age=ageOf(st);
 let nb=new Date(now.getFullYear(),BIRTH.getMonth(),BIRTH.getDate());if(nb<=new Date(now.getFullYear(),now.getMonth(),now.getDate()))nb=new Date(now.getFullYear()+1,BIRTH.getMonth(),BIRTH.getDate());const dleft=Math.round((nb-new Date(now.getFullYear(),now.getMonth(),now.getDate()))/86400000);
 const gl=globalLevel();const adv=gl-3;
 const week=sess.filter(x=>x.ts>Date.now()-7*86400000);const wq=week.reduce((a,x)=>a+x.n,0),wok=week.reduce((a,x)=>a+x.ok,0),wmin=Math.round(week.reduce((a,x)=>a+(x.ms||0),0)/60000);
 const nm=st.name||'l\'élève';
 app.append(h('div',{},h('p',{class:'label'},`${age} ans · ${age+1} ans dans ${dleft} jour${dleft>1?'s':''} · ${st.classe||'6e'}`),h('h1',{},`Progrès de ${nm}`)));
 if(!sess.length)app.append(h('div',{class:'banner'},'Aucune session pour l\'instant. La première étape côté élève est le bilan de départ (22 questions). Les graphiques et l\'analyse apparaîtront ensuite ici, mis à jour après chaque réponse.'));
 // KPIs
 app.append(h('div',{class:'grid g4'},
  h('div',{class:'card kpi'},h('p',{class:'label'},'Niveau global'),h('p',{class:'v'},gradeOf(gl)),h('p',{class:'s'},gl.toFixed(2)+' / 10 · '+(adv>=0.5?`environ ${fmt(Math.round(adv*10)/10)} an${adv>=1.5?'s':''} d'avance`:adv<=-0.5?'en dessous de la 6e pour l\'instant':'au niveau de sa classe'))),
  h('div',{class:'card kpi'},h('p',{class:'label'},'Régularité'),h('p',{class:'v'},`${st.streak||0} j`),h('p',{class:'s'},`série actuelle · record ${st.bestStreak||0} j`)),
  h('div',{class:'card kpi'},h('p',{class:'label'},'Précision 7 jours'),h('p',{class:'v'},wq?Math.round(wok/wq*100)+' %':'—'),h('p',{class:'s'},`${wq} questions cette semaine`)),
  h('div',{class:'card kpi'},h('p',{class:'label'},'Temps de travail'),h('p',{class:'v'},wmin+' min'),h('p',{class:'s'},'sur les 7 derniers jours'))));
 // tableau domaines
 const ref7=sess.filter(x=>x.ts<Date.now()-7*86400000).pop()||sess[0];
 const rows=DOMAINS.slice().sort((a,b)=>st.levels[b.k]-st.levels[a.k]).map(d=>{const L=st.levels[d.k];const prev=ref7&&ref7.levels?ref7.levels[d.k]:null;const dl=prev!=null?L-prev:0;
  return h('tr',{},h('td',{},h('span',{class:'dchip'},h('i',{class:'dot',style:`background:${d.c}`}),d.n)),h('td',{style:'width:38%'},h('div',{class:'lbar',title:`${L.toFixed(2)} / 10`},h('i',{style:`width:${L*10}%;background:${d.c}`}),h('b',{style:'left:30%',title:'niveau 6e'}))),h('td',{class:'mono'},gradeOf(L)),h('td',{class:'mono '+(dl>0.05?'up':dl<-0.05?'down':'faint')},prev==null?'—':(dl>=0?'+':'')+dl.toFixed(2)),h('td',{class:'mono faint'},String(st.counts[d.k]||0)))});
 const strongest=DOMAINS.slice().sort((a,b)=>st.levels[b.k]-st.levels[a.k]);
 app.append(h('div',{class:'grid g2'},
  h('div',{class:'card'},h('div',{class:'row',style:'justify-content:space-between;margin-bottom:8px'},h('h2',{},'Niveau par domaine'),h('span',{class:'faint',style:'font-size:.8rem'},'trait blanc = niveau 6e')),h('div',{class:'scroll'},h('table',{class:'ptab'},h('thead',{},h('tr',{},h('th',{},'Domaine'),h('th',{},'Niveau'),h('th',{},'Équivalent'),h('th',{},'7 j'),h('th',{},'Questions'))),h('tbody',{},rows)))),
  h('div',{class:'grid'},
   h('div',{class:'card'},h('h2',{style:'margin-bottom:10px'},'Évolution du niveau global'),levelChart(sess)),
   h('div',{class:'card'},h('h3',{style:'margin-bottom:10px'},'Activité des 12 dernières semaines'),heatmap(sess),h('p',{class:'note',style:'margin-top:8px'},`Points forts : ${strongest.slice(0,2).map(d=>d.n).join(', ')}. À renforcer : ${strongest.slice(-2).map(d=>d.n).join(', ')}.`)))));
 // IA + erreurs + défis
 const errs=sess.flatMap(x=>(x.answers||[]).filter(a=>!a.ok).map(a=>Object.assign({day:x.day},a))).slice(-12).reverse();
 const defis=sess.filter(x=>x.defi&&x.defi.note!=null).slice(-5).reverse();
 app.append(h('div',{class:'grid g2'},
  aiCard(sess),
  h('div',{class:'card'},h('h2',{style:'margin-bottom:10px'},'Dernières erreurs'),errs.length?h('div',{class:'errlist'},errs.map(a=>h('div',{class:'err'},h('span',{class:'dchip faint'},h('i',{class:'dot',style:`background:${DM[a.d]?.c||'#888'}`}),(DM[a.d]?.n||a.d)+' · '+gradeOf(a.lvl)+' · '+a.day),h('span',{class:'q'},a.q),h('span',{},h('span',{class:'down'},'Sa réponse : '+(a.given||'—')),'   ',h('span',{class:'up'},'Attendu : '+a.right))))):h('p',{class:'muted'},'Aucune erreur enregistrée pour l\'instant.'))));
 if(defis.length)app.append(h('div',{class:'card'},h('h2',{style:'margin-bottom:10px'},'Défis de réflexion'),h('div',{class:'errlist'},defis.map(x=>h('div',{class:'err'},h('span',{class:'faint'},x.day+' · note '+x.defi.note+'/10'),h('span',{class:'q'},x.defi.prompt),h('p',{style:'white-space:pre-wrap'},x.defi.reponse),h('p',{class:'muted'},'Correcteur : '+(x.defi.bravo||'')+' '+(x.defi.ameliorer||'')))))));
 app.append(settingsCard());
 app.append(h('p',{class:'note'},'Les niveaux sont une estimation interne calculée à partir de ses réponses (comme un classement Elo aux échecs), pas un test officiel ni une mesure du QI. Ils sont fiables après une à deux semaines de missions régulières.'));
}
function levelChart(sess){
 const pts=sess.filter(x=>typeof x.global==='number').slice(-40);
 if(pts.length<2)return h('p',{class:'muted'},'La courbe apparaîtra après deux sessions.');
 const W=560,H=200,pl=34,pr=10,pt=10,pb=24;
 const vals=pts.map(p=>p.global);let lo=Math.floor(Math.min(3,...vals)-.3),hi=Math.ceil(Math.max(...vals)+.3);lo=Math.max(1,lo);hi=Math.min(10,Math.max(hi,lo+2));
 const X=i=>pl+(W-pl-pr)*(i/(pts.length-1)),Y=v=>pt+(H-pt-pb)*(1-(v-lo)/(hi-lo));
 const g=s('svg',{class:'chart',viewBox:`0 0 ${W} ${H}`,width:'100%',role:'img','aria-label':'Courbe du niveau global par session'});
 for(let v=lo;v<=hi;v++){g.append(s('line',{x1:pl,x2:W-pr,y1:Y(v),y2:Y(v),stroke:v===3?'rgba(255,255,255,.35)':'rgba(255,255,255,.07)','stroke-dasharray':v===3?'4 4':null}),s('text',{x:pl-6,y:Y(v)+3,'text-anchor':'end'},GRADES[v]))}
 const line=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p.global).toFixed(1)).join(' ');
 g.append(s('path',{d:line+` L ${X(pts.length-1)} ${H-pb} L ${X(0)} ${H-pb} Z`,fill:'rgba(255,193,69,.12)'}),s('path',{d:line,fill:'none',stroke:'#FFC145','stroke-width':2.5,'stroke-linejoin':'round'}));
 const last=pts[pts.length-1];g.append(s('circle',{cx:X(pts.length-1),cy:Y(last.global),r:5,fill:'#FFC145',stroke:'#0B1026','stroke-width':2}));
 g.append(s('text',{x:X(0),y:H-6},pts[0].day.slice(5).split('-').reverse().join('/')),s('text',{x:X(pts.length-1),y:H-6,'text-anchor':'end'},last.day.slice(5).split('-').reverse().join('/')));
 return h('div',{class:'scroll'},g);
}
function heatmap(sess){
 const by={};sess.forEach(x=>{by[x.day]=(by[x.day]||0)+x.n});
 const today=new Date();const start=addDays(today,-(7*12-1)-((today.getDay()+6)%7));
 const box=h('div',{class:'heat',role:'img','aria-label':'Calendrier d\'activité'});
 for(let d=new Date(start);d<=today;d=addDays(d,1)){const k=dayKey(d);const n=by[k]||0;const a=n?clamp(.25+n/30,.25,1):0;box.append(h('i',{title:`${k} : ${n} question${n>1?'s':''}`,style:n?`background:rgba(255,193,69,${a})`:''}))}
 return box;
}
function aiCard(sess){
 const out=h('div',{class:'ai-out',id:'ai-out'},lastAnalysis||(AI.off?'L\'IA n\'est pas encore activée sur le serveur.':'Cliquez sur « Analyser » pour obtenir un bilan personnalisé : forces, lacunes, et un plan concret pour les 7 prochains jours.'));
 const btn=h('button',{class:'btn',disabled:AI.off||!sess.length},'Analyser avec l\'IA');
 btn.addEventListener('click',async()=>{
  btn.disabled=true;analysing=true;out.textContent='Analyse en cours… (environ 30 secondes)';
  const st=S();const recent=sess.slice(-20);
  const domaines=DOMAINS.map(d=>{const as=recent.flatMap(x=>(x.answers||[]).filter(a=>a.d===d.k));return{nom:d.n,niveau:+st.levels[d.k].toFixed(2),classe:gradeOf(st.levels[d.k]),reponses:as.length,justes:as.filter(a=>a.ok).length}});
  const erreurs=recent.flatMap(x=>(x.answers||[]).filter(a=>!a.ok).map(a=>({domaine:a.d,niveau:a.lvl,question:a.q,reponse:a.given,attendu:a.right}))).slice(-25);
  const defis=recent.filter(x=>x.defi&&x.defi.note!=null).map(x=>({defi:x.defi.prompt,note:x.defi.note}));
  try{const j=await callAI('analysis',{prenom:st.name||'',age:ageOf(st),serie:st.streak,total:st.total,precision:st.total?Math.round(st.correct/st.total*100):0,sessions:recent.length,domaines,erreurs,defis});lastAnalysis=String(j.text||'');const el=document.getElementById('ai-out');if(el)el.textContent=lastAnalysis}
  catch(e){const el=document.getElementById('ai-out');if(el)el.textContent=aiMsg(e)}
  analysing=false;btn.disabled=false;
 });
 return h('div',{class:'card'},h('div',{class:'row',style:'justify-content:space-between;margin-bottom:10px'},h('h2',{},'Analyse IA'),btn),out);
}
let confirmReset=false;
function settingsCard(){
 const st=S();
 const nameI=h('input',{id:'set-name',value:st.name||'',placeholder:'Son prénom'});
 const lenS=h('select',{id:'set-len'},[8,10,12,15,20].map(n=>h('option',{value:n,selected:st.missionLen===n},n+' questions')));
 const codeI=h('input',{id:'set-code',value:st.parentCode||'',placeholder:'Aucun',inputmode:'numeric',maxlength:8});
 const birthI=h('input',{id:'set-birth',type:'date',value:st.birth||'2016-01-05'});
 const classeI=h('select',{id:'set-classe'},['CM2','6e','5e','4e','3e'].map(c=>h('option',{value:c,selected:(st.classe||'6e')===c},c)));
 const saved=h('span',{class:'up',hidden:true},'Enregistré');
 const save=async()=>{const vals={name:nameI.value.trim().slice(0,30),missionLen:+lenS.value,parentCode:codeI.value.trim(),birth:birthI.value||'2016-01-05',classe:classeI.value};try{await Store.load()}catch(e){}Object.assign(S(),vals);Store.save();saved.hidden=false;setTimeout(()=>{saved.hidden=true},1600)};
 const resetZone=h('div',{class:'row'});
 const drawReset=()=>{resetZone.replaceChildren(confirmReset?h('span',{},h('span',{class:'down'},'Effacer tous les niveaux et l\'XP ? (l\'historique des sessions reste) '),h('button',{class:'btn small ghost',onclick:()=>{const keep={name:st.name,parentCode:st.parentCode,missionLen:st.missionLen,birth:st.birth,classe:st.classe};Store.S=normalize(keep);Store.save();confirmReset=false;render()}},'Oui, effacer'),' ',h('button',{class:'btn small ghost',onclick:()=>{confirmReset=false;drawReset()}},'Annuler')):h('button',{class:'btn small ghost',onclick:()=>{confirmReset=true;drawReset()}},'Réinitialiser les niveaux'))};drawReset();
 return h('div',{class:'card'},h('h2',{style:'margin-bottom:12px'},'Réglages'),
  h('div',{class:'grid g3'},h('div',{class:'field'},h('label',{for:'set-name'},'Prénom'),nameI),h('div',{class:'field'},h('label',{for:'set-len'},'Longueur de la mission'),lenS),h('div',{class:'field'},h('label',{for:'set-code'},'Code de l\'espace parent'),codeI),h('div',{class:'field'},h('label',{for:'set-birth'},'Date de naissance'),birthI),h('div',{class:'field'},h('label',{for:'set-classe'},'Classe'),classeI)),
  h('div',{class:'row',style:'margin-top:14px'},h('button',{class:'btn small',onclick:save},'Enregistrer'),saved,h('span',{class:'spacer'}),resetZone));
}

/* ================= Ciel étoilé ================= */
(function sky(){const cv=document.getElementById('sky');const cx=cv.getContext('2d');let stars=[];const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function size(){cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;stars=Array.from({length:Math.round(innerWidth*innerHeight/9000)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:(Math.random()*1.2+.2)*devicePixelRatio,p:Math.random()*6}))}
 function draw(t){cx.clearRect(0,0,cv.width,cv.height);for(const s of stars){const a=reduce?.6:.35+.35*Math.sin(t/1400+s.p);cx.fillStyle=`rgba(220,228,255,${a})`;cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.283);cx.fill()}if(!reduce)requestAnimationFrame(draw)}
 size();addEventListener('resize',size);requestAnimationFrame(draw)})();

boot();
