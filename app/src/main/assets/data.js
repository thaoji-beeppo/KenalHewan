/* Data hewan + semua kalimat narator.
   File ini dipakai aplikasi DAN oleh tools/narasi.py (lewat tools/lines.js) untuk membuat rekaman suara narator.
   Kalau kalimat diubah, rekaman otomatis dibuat ulang saat build di GitHub Actions. */
const HAB={
  rumah:{ic:'🏡',sky1:'#7fd3ff',sky2:'#d6f3ff',g:'#7ed957',g2:'#5bbf3a',sun:'#ffd93b'},
  hutan:{ic:'🌳',sky1:'#9be7b0',sky2:'#e2ffd9',g:'#3fae5a',g2:'#2c8a45',sun:'#fff3a6'},
  laut:{ic:'🌊',sky1:'#2a9df4',sky2:'#7fdcff',g:'#f5d48b',g2:'#e8bd62',sun:'#ffd93b'},
  langit:{ic:'🌸',sky1:'#ffc2dc',sky2:'#fff1c9',g:'#9be36a',g2:'#ff9ec4',sun:'#ffcf33'}
};
const A=[
 ['🐱','Kucing','Meong meong!','Kucing suka minum susu','rumah'],
 ['🐶','Anjing','Guk guk guk!','Anjing suka main bola','rumah'],
 ['🐮','Sapi','Mooo!','Sapi kasih kita susu','rumah'],
 ['🐔','Ayam','Kukuruyuuuk!','Ayam bertelur','rumah'],
 ['🦆','Bebek','Kwek kwek!','Bebek suka berenang','rumah'],
 ['🐐','Kambing','Mbeee!','Kambing makan rumput','rumah'],
 ['🐴','Kuda','Hiiihiii!','Kuda larinya cepat','rumah'],
 ['🐰','Kelinci','Hop hop hop!','Kelinci suka wortel','rumah'],
 ['🦁','Singa','Auuum!','Singa raja hutan','hutan'],
 ['🐯','Harimau','Grrrr!','Harimau badannya belang','hutan'],
 ['🐘','Gajah','Prooot!','Gajah belalainya panjang','hutan'],
 ['🐵','Monyet','Uu aa aa!','Monyet suka pisang','hutan'],
 ['🦒','Jerapah','Hmmm!','Jerapah lehernya panjang','hutan'],
 ['🐻','Beruang','Hrrrr!','Beruang suka madu','hutan'],
 ['🐼','Panda','Nyam nyam!','Panda makan bambu','hutan'],
 ['🐸','Katak','Kwok kwok!','Katak lompatnya jauh','hutan'],
 ['🐟','Ikan','Blub blub!','Ikan berenang di air','laut'],
 ['🐳','Paus','Byuuur!','Paus besar sekali','laut'],
 ['🐬','Lumba-lumba','Cik cik cik!','Lumba-lumba pintar melompat','laut'],
 ['🐙','Gurita','Blup blup!','Gurita kakinya banyak','laut'],
 ['🐢','Kura-kura','Pelan pelan!','Kura-kura bawa rumahnya','laut'],
 ['🦀','Kepiting','Capit capit!','Kepiting jalannya miring','laut'],
 ['🐦','Burung','Cuit cuit!','Burung bisa terbang','langit'],
 ['🦋','Kupu-kupu','Wus wus!','Kupu-kupu sayapnya cantik','langit'],
 ['🐝','Lebah','Nguuung!','Lebah membuat madu','langit'],
 ['🦉','Burung hantu','Uhu uhu!','Burung hantu bangun malam','langit'],
 ['🐞','Kepik','Wiii!','Kepik punya titik-titik','langit'],
 /* hewan yang sering dilihat anak Indonesia */
 ['🦎','Cicak','Cek cek cek!','Cicak suka di dinding','rumah'],
 ['🐃','Kerbau','Ngooo!','Kerbau suka berendam di lumpur','rumah'],
 ['🐑','Domba','Mbeee!','Bulu domba tebal dan lembut','rumah'],
 ['🐭','Tikus','Cit cit cit!','Tikus kecil suka keju','rumah'],
 ['🐜','Semut','Jalan jalan!','Semut suka yang manis','rumah'],
 ['🦟','Nyamuk','Nguuing!','Nyamuk suka gigit, hush hush','rumah'],
 ['🐌','Siput','Pelan pelan!','Siput bawa rumahnya','rumah'],
 ['🦢','Angsa','Kwak kwak!','Angsa lehernya panjang','rumah'],
 ['🐊','Buaya','Hap hap!','Buaya giginya banyak','hutan'],
 ['🐍','Ular','Sssss!','Ular tidak punya kaki','hutan'],
 ['🦧','Orangutan','Uuu uuu!','Orangutan dari Kalimantan','hutan'],
 ['🦏','Badak','Hmph!','Badak punya cula','hutan'],
 ['🐿️','Tupai','Cik cik cik!','Tupai suka kacang','hutan'],
 ['🦗','Jangkrik','Krik krik krik!','Jangkrik bunyi kalau malam','langit'],
 ['🕊️','Burung merpati','Kur kur kur!','Merpati suka terbang bareng','langit'],
 ['🦜','Burung beo','Halo halo!','Burung beo bisa meniru suara','langit'],
 ['🦚','Burung merak','Ee-ooo!','Ekor merak cantik sekali','langit'],
 ['🦇','Kelelawar','Cit cit!','Kelelawar tidur terbalik','langit']
].map(([e,n,s,f,h])=>({e,n,s,f,h,id:n.toLowerCase().replace(/[^a-z]+/g,'_')}));

/* Kalimat narator — gaya ngobrol ke anak. "..." = jeda napas. {n}=nama, {s}=bunyi.
   Hemat kuota ElevenLabs: per hewan cuma 4 kalimat, sisanya kalimat umum. */
const P={
 intro:['Eh, lihat deh... ada {n}, nih!'],
 ask:['Coba cari... {n} di mana, ya?'],
 itu:['Itu {n}!'],
 tiru:['Sekarang adik coba... {s}'],
 praise:['Hebat!','Pintar sekali!','Yeay, betul!','Wah, keren!'],
 wrong:['Hmm... bukan yang itu. Coba lagi, ya!','Eits, bukan itu. Ayo, coba lagi!'],
 after:['Hihi, lucu, ya!','Dengar nggak, suaranya?'],
 home:['Halo! Yuk, main sama hewan!','Hai! Mau ketemu hewan apa hari ini?'],
 bub:['Ayo, pecahkan gelembungnya!','Wah, banyak gelembung! Ayo, pecahkan!']
};
const PER_ANIMAL=['intro','ask','itu','tiru'];
function fill(t,a){
  if(a)t=t.replace(/\{n\}/g,a.n.toLowerCase()).replace(/\{s\}/g,a.s).replace(/\{f\}/g,a.f);
  return t.charAt(0).toUpperCase()+t.slice(1);
}
/* kunci file rekaman: narasi/<kind>_<id>_<i>.mp3 atau narasi/<kind>_<i>.mp3 */
function line(kind,a,i){
  const list=P[kind];if(i==null)i=Math.floor(Math.random()*list.length);
  return {key:kind+(a?'_'+a.id:'')+'_'+i,text:fill(list[i],a)};
}
function allLines(){
  const out=[];
  for(const k of Object.keys(P)){
    if(PER_ANIMAL.includes(k)){for(const a of A)P[k].forEach((_,i)=>out.push(line(k,a,i)))}
    else P[k].forEach((_,i)=>out.push(line(k,null,i)));
  }
  return out;
}
if(typeof module!=='undefined')module.exports={A,P,allLines};
