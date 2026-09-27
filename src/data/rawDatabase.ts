import { ContactRecord } from '../types';
import { detectBdOperator } from '../utils/fbUidExtractor';

/**
 * RAW DATABASE FILE (আলাদা ডাটাবেজ ফাইল)
 * Format: Phone:UID:FirstName:LastName:Gender:City:Hometown:Relationship:Work:Birthday:Email:Extra
 */
export const RAW_DATABASE_TEXT = `8801515224058:100006738752653:Ehsan:Onol:laki-laki:Dhaka::Lajang:Criminal Mind:1/1/0001 12:00:00 AM:ehsanahmedonol@gmail.com:
8801515221444:100006432297121:Md:Uddin:laki-laki:Chittagong:Chittagong:::1/1/0001 12:00:00 AM::
8801515221397:100001664254221:Engr:Islam Sowrov:laki-laki:::::1/1/0001 12:00:00 AM::
8801515221345:100001058513702:Maiukh:Akit:laki-laki:::::1/1/0001 12:00:00 AM::
8801515221333:100013018907469:Rajdip:Palit:laki-laki:::::1/1/0001 12:00:00 AM::
8801515221310:100003803134511:Nur:Muhaimin:laki-laki:Chittagong:Chittagong:Lajang:Rotaract Club of Chittagong City Central:1/1/0001 12:00:00 AM::01/23/1996
8801515221305:100000368932041:Ashraful Islam:Rohit:laki-laki:Chittagong:Noakhali, Chittagong, Bangladesh:Lajang::1/1/0001 12:00:00 AM::12/08/1991
8801515221285:100034280080962:Saniya:Chowdhury:perempuan:::::1/1/0001 12:00:00 AM::
8801515221273:100004253715126:Minhaj:Arefin:laki-laki:Chittagong:Bhola, Barisal, Bangladesh:Lajang:Allah's world:1/1/0001 12:00:00 AM::06/18
8801515221255:100008325751712:Munna:Bsl:laki-laki::Chittagong::Bangabandhu Chhatra Parishad:1/1/0001 12:00:00 AM::
8801515221252:100001435111928:Tashrik:Anam Partho:laki-laki:Chittagong:Jessore, Khulna, Bangladesh:Lajang:eCommunities:1/1/0001 12:00:00 AM::
8801515221242:100010727232723:Bindo:Nath:laki-laki:::::1/1/0001 12:00:00 AM::
8801515221206:100036609049846:Shariat Ullah:Tuhin::::::1/1/0001 12:00:00 AM::
8801515221203:100000119158905:Rahabar Bin:Hossain:laki-laki:::Rumit::1/1/0001 12:00:00 AM::
8801515221184:100005664699263:Hasnain:Ahmed:laki-laki:::::1/1/0001 12:00:00 AM::
8801515221174:100016880233502:Srabani:Dey:perempuan:::::1/1/0001 12:00:00 AM::
8801515221139:100014473278157:Hosen:Hossain:laki-laki:Dhaka::::1/1/0001 12:00:00 AM::
8801515221132:100007563709313:Younus:Sohel:laki-laki:Chittagong:Chittagong:Lajang:Theatre Unit Alo-Chaya:1/1/0001 12:00:00 AM::
8801515221119:100003654518161:MD:Chowdhury:laki-laki:Chittagong:Chittagong::Civil engineering:1/1/0001 12:00:00 AM::
8801515221096:100008694043250:Mahamuda:Akter Mou:perempuan:::::1/1/0001 12:00:00 AM::
8801515221092:100002767496543:Umme:Nurain:perempuan:Chittagong:Chittagong:Menikah:National Credit Ratings Limited - ncr:1/1/0001 12:00:00 AM::
8801515221076:100008158875757:Hoimanty:Nondy:perempuan:::::1/1/0001 12:00:00 AM::
8801515221063:100001584480674:Romanch:Sen:laki-laki:Chittagong:Chittagong:Lajang:Standard Asiatic Oil Company Limited:1/1/0001 12:00:00 AM::
8801515220900:100002981022432:Mohammad:Saiful:laki-laki:Chittagong:Chittagong:Rumit::1/1/0001 12:00:00 AM::
8801515220870:100019407453505:Mahbubur:Rahman:laki-laki:::::1/1/0001 12:00:00 AM::
8801515220845:100034747533754:Safayet:Mahamud:laki-laki:::::1/1/0001 12:00:00 AM::
8801515220706:100027653797648:Byabosayik:CoxsBazar:laki-laki:Cox's Bazar:Chittagong:Berpacaran:Visit Bangla:1/1/0001 12:00:00 AM::
8801515220583:100028565347675:Athoi:Nilima:perempuan:Jessore, Khulna, Bangladesh:Jessore, Khulna, Bangladesh:::1/1/0001 12:00:00 AM::
8801515220578:100015408400760:Tareq:Aziz:laki-laki:Cox's Bazar:Cox's Bazar::Social Work:1/1/0001 12:00:00 AM::
8801515223559:100013102608966:Duduk:Changma:laki-laki:Rangamati, Chittagong, Bangladesh:Rangamati, Chittagong, Bangladesh:Lajang:Studying:1/1/0001 12:00:00 AM::
8801515223554:100010244192336:Angel:Chakma:laki-laki:Rangamati, Chittagong, Bangladesh:Rangamati, Chittagong, Bangladesh::Study (chess):1/1/0001 12:00:00 AM::
8801515223550:100009488298599:Hiron:Chakma:laki-laki:Rangamati:Rangamati, Chittagong, Bangladesh:Lajang:College Student:1/1/0001 12:00:00 AM::
8801515223506:100002411970300:Imon:Biswas:laki-laki:Chittagong::::1/1/0001 12:00:00 AM::08/15
8801515223501:100024037343845:AliAkkas:Murad:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223461:100020304729277:Faiza:Shuma::Chittagong:Chittagong:::1/1/0001 12:00:00 AM::
8801515223428:100007381294559:Suponkar:Chakma:laki-laki:Rangamati, Chittagong, Bangladesh:Rangamati::Rangamati Ideal School:1/1/0001 12:00:00 AM::01/01
8801515223426:100011539051469:Ullash:Chakma:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223425:100033254899134:Machh:Baja:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223408:100004980880325:Jummo:Chakma:laki-laki:Dhaka:Rangamati::Student:1/1/0001 12:00:00 AM::
8801515223398:100002704952365:Tretiya:Chakma:perempuan:::Menikah::1/1/0001 12:00:00 AM::
8801515223387:100032942872360:Jum:Jum:perempuan:::::1/1/0001 12:00:00 AM::
8801515223380:100034338470727:Liton:Chakma:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223364:100037888787384:Zawe:H:::Rangamati, Chittagong, Bangladesh:Berpacaran::1/1/0001 12:00:00 AM::
8801515223344:532230584:Shawkat:Mostafa:laki-laki:Dhaka:Chittagong::Govt. of Bangladesh:1/1/0001 12:00:00 AM::
8801515223332:100012192161375:Sayan:Chakma:laki-laki:Dhaka:Rangamatia, Chittagong, Bangladesh:::1/1/0001 12:00:00 AM::
8801515223324:100037679496373:Siful:Islam::::::1/1/0001 12:00:00 AM::
8801515223317:100001714368586:Jilu:Chakma:laki-laki:Dhaka:Khagrachari, Chittagong, Bangladesh::Facebook:1/1/0001 12:00:00 AM::
8801515223313:100009857795479:Da:Jol:laki-laki:Chittagong:Khagrachari, Chittagong, Bangladesh:Lajang:Studying:1/1/0001 12:00:00 AM::
8801515223306:100012203746775:Mritika:Chakma:perempuan:::::1/1/0001 12:00:00 AM::
8801515223291:100009434237944:Saddam:Hossen:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223251:100007110302061:Alone:Jojo:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223224:100007508893825:Jahir:Ahammad:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223216:100037355838119:D:Chw::::::1/1/0001 12:00:00 AM::
8801515223215:100007298856752:Abriyan:Saiful:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223212:100012223607378:SaZz:Chy:laki-laki:Chittagong:Khagrachari, Chittagong, Bangladesh:Lajang:Freelance Photography:1/1/0001 12:00:00 AM::
8801515223210:100030454502464:Asmi:Chiku:perempuan:::::1/1/0001 12:00:00 AM::
8801515223194:100023098431780:Arati:Chakma:perempuan:::::1/1/0001 12:00:00 AM::
8801515223171:100029181493270:Dines:Kartik:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223129:100028532672316:Kajala:Ckz:perempuan:::Lajang::1/1/0001 12:00:00 AM::
8801515223103:100024691039544:Nayan:Chungma:laki-laki:Dhaka::::1/1/0001 12:00:00 AM::
8801515223092:100003458691062:Nazmul:P II:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223088:100027352878667:Md Tanvir:Hossen:laki-laki::Khagrachari, Chittagong, Bangladesh:::1/1/0001 12:00:00 AM::
8801515223087:100007414898899:Saday:Chakma:laki-laki:Dhaka:::Music and Chatting:1/1/0001 12:00:00 AM::
8801515223086:100025321401406:Pristine-heart:Marma:laki-laki:::::1/1/0001 12:00:00 AM::
8801515223055:100021573011116:Saima:Sumaiya:perempuan:Dhaka:Khagrachari, Chittagong, Bangladesh:Menikah::1/1/0001 12:00:00 AM::
8801515223037:100014534291786:Dukhhahin:Balok:laki-laki:Khagrachari, Chittagong, Bangladesh:Chittagong:::1/1/0001 12:00:00 AM::
8801515223025:100024494165523:Babusay:Plengsa:laki-laki:Khagrachari, Chittagong, Bangladesh:Guimara, Chittagong, Bangladesh:::1/1/0001 12:00:00 AM::
8801515223018:100002044375977:Shafiqul:Azam:laki-laki:::::1/1/0001 12:00:00 AM::
8801515222970:100005671361783:Farid:Uddin:laki-laki:Chittagong:Chittagong:::1/1/0001 12:00:00 AM::
8801515222944:100009318650449:Ankita:Chowdhury:perempuan:Chittagong:Chittagong:::1/1/0001 12:00:00 AM::
8801515222943:100037136255928:Bishwajit:Chowdhury::Chittagong:Chittagong:::1/1/0001 12:00:00 AM::
8801515222927:100014550605306:Khaleda:Begum:perempuan:::::1/1/0001 12:00:00 AM::
8801515222889:100008222594843:Masudul:Nasim:laki-laki:Chittagong:Comilla:Lajang:BTEB - Bangladesh Technical Education Board:1/1/0001 12:00:00 AM::
8801515222885:100018622996540:Brishti:Dash:perempuan:::::1/1/0001 12:00:00 AM::
8801515222879:100001688791873:Abid:Tawsif:laki-laki:Dhaka:Chittagong:Lajang::1/1/0001 12:00:00 AM::
8801515222826:100035678177970:Misu:Pal:laki-laki:::::1/1/0001 12:00:00 AM::
8801515222780:100022053844637:Fahmi:Tasnim:perempuan:::::1/1/0001 12:00:00 AM::
8801515222729:100003579167562:Hrishin:Palit:laki-laki:Chittagong:Chittagong::Nagarful:1/1/0001 12:00:00 AM::
8801515222718:100002437125136:Solaiman:Hridoy:laki-laki:Chittagong:Cox's Bazar:::1/1/0001 12:00:00 AM::
8801515222682:100000420675859:Shuvo:Chakraborty:laki-laki:Chittagong:Chittagong:Lajang:University of Science and Technology Chittagong:1/1/0001 12:00:00 AM::
8801515222650:100021805483226:Muhammad:Taif:perempuan:::::1/1/0001 12:00:00 AM::
8801515222634:100005955632604:Roy:Dipta:laki-laki:Chittagong:Chittagong::Chittagong Textile Engineering College.(CTEC):1/1/0001 12:00:00 AM::
8801515222632:100001213961719:Raihan:Ahmed:laki-laki:::::1/1/0001 12:00:00 AM::
8801515222621:100002356766804:Asif:Arafat:laki-laki:::Lajang:University of Chittagong:1/1/0001 12:00:00 AM::
8801515222602:100030134620554:Anish:Chowdhury:laki-laki:::::1/1/0001 12:00:00 AM::
8801515222546:100003813742521:Shahabuddin:Manik:laki-laki:Chittagong:Satkania, Chittagong, Bangladesh:Lajang:Student:1/1/0001 12:00:00 AM::
8801515222535:100002657277711:Sagor:Barua:laki-laki:::::1/1/0001 12:00:00 AM::
8801515222471:100002342426898:Anindo:Rudro:laki-laki:Chittagong:Chittagong:Lajang:Char Chakar Album:1/1/0001 12:00:00 AM::
8801515222456:100002400677366:Mominul:Islam:laki-laki:Chittagong:Rangamati:Lajang:Bangladesh Rural Electrification Board-BREB:1/1/0001 12:00:00 AM::
8801515222437:100004826010551:Meherun:Jakir:perempuan:Chittagong:Chittagong::Regency Garments Ltd, CEPZ, Chittagong:1/1/0001 12:00:00 AM::
8801515222428:100010591308033:Jon:Abraham:laki-laki:London:Americana, Sao Paulo:::1/1/0001 12:00:00 AM::
8801515222422:100028249053431:Jani:Na:laki-laki:Chittagong::::1/1/0001 12:00:00 AM::
8801515222419:100006297392205:Sudip:De:laki-laki:Chittagong:Chittagong:Lajang:Woodprints:1/1/0001 12:00:00 AM::
8801515222397:100004014842430:Itish:Chakma:laki-laki:Chittagong:Rangamati:Lajang:Student:1/1/0001 12:00:00 AM::
8801515222295:100005902327574:Mahbub:Alam:laki-laki:Chittagong:Comilla::Chittagong District Sea Scouts:1/1/0001 12:00:00 AM::
8801515222271:100002602517292:Ali Akbar:Jiko:laki-laki:::::1/1/0001 12:00:00 AM::
8801515222242:100024108454507:Nirob:Chowdhury:laki-laki:Chittagong:Chittagong:Menjalin hubungan tanpa status:Business:1/1/0001 12:00:00 AM::
8801515222222:100008176570713:Monira:Hoque:perempuan:::::1/1/0001 12:00:00 AM::
8801515222208:100003315872134:Md:Faisal:laki-laki:Chittagong:Lakshmipur, Chittagong, Bangladesh:::1/1/0001 12:00:00 AM::
8801515222086:100014850949015:Shakil Hossan:Hossan:laki-laki:Chittagong:Chittagong::Chittagong District Sea Scouts:1/1/0001 12:00:00 AM::
8801515224996:100007875241339:Santa:Saha:perempuan:::::1/1/0001 12:00:00 AM::
8801515224949:100004418590516:Nayon:Karmaker:laki-laki:Dhaka:Comilla:Lajang:United Commercial Bank Ltd.:1/1/0001 12:00:00 AM::
8801515224708:100007028058293:Mohammad Kamrul:Hossain:laki-laki:Khulna:Comilla:Lajang:Khulna University of Engineering & Technology:1/1/0001 12:00:00 AM::
8801515224672:100004224612655:Promesh:Chakma:laki-laki:Comilla:Khagrachari, Chittagong, Bangladesh:Lajang::1/1/0001 12:00:00 AM::
8801515224470:100001240441490:Shahid:Hossain:laki-laki:Dhaka:Comilla:Lajang:Intercontinental Consultants and Technocrats Pvt. Ltd.:1/1/0001 12:00:00 AM::
8801515224443:100036162063312:Anowar:Sarker:laki-laki:Comilla:Comilla:::1/1/0001 12:00:00 AM::
8801515224414:100002893796461:Nesar:Ahmad:laki-laki:Comilla:Comilla:Lajang::1/1/0001 12:00:00 AM::02/20/1992
8801515224371:100007200184927:Khaled:Saifulla:laki-laki:Comilla:Khagrachari, Chittagong, Bangladesh:Menikah:Comilla University:1/1/0001 12:00:00 AM::
8801515224351:100005746390160:Bristy:Kalam:perempuan:Comilla:Brahmanbaria, Chittagong, Bangladesh:::1/1/0001 12:00:00 AM::
8801515224321:100005779513583:Mahdi:Hasan:laki-laki:Comilla:Brahmanbaria, Chittagong, Bangladesh:Lajang:Elite Force:1/1/0001 12:00:00 AM::04/09/1996
8801515224262:100006292390794:Jahidul Alam:Rahat:laki-laki:Dhaka:Khagrachari, Chittagong, Bangladesh:Lajang:Student:1/1/0001 12:00:00 AM::
8801515224078:100003331974640:Mayen Uddin:Rasel:laki-laki:Ramna, Dhaka, Bangladesh:Feni (town):Lajang::1/1/0001 12:00:00 AM::
8801515226453:100026929568583:Sakib:Ahmed:laki-laki:Kustia, Dhaka, Bangladesh:Jessore, Khulna, Bangladesh:Lajang:Facebook:1/1/0001 12:00:00 AM::03/25
8801515226157:100010045410889:Tasrif:Ahmed:laki-laki:Rajshahi:Rajshahi:Lajang::1/1/0001 12:00:00 AM::
8801515225342:100008681194001:Afran:Mahmud:laki-laki:Comilla:Comilla:Lajang:Studying:1/1/0001 12:00:00 AM::
8801515225260:100003052897625:Hamim:Hasib:laki-laki:Dhaka:Chandpur, Chittagong, Bangladesh:Lajang::1/1/0001 12:00:00 AM::08/23/1996
8801515227305:100014421434161:Loknath:SaHa:laki-laki:Dhaka:Faridpur, Dhaka, Bangladesh::Udvash:1/1/0001 12:00:00 AM::
8801515227268:100005601944307:Seam:Rahman:laki-laki:Dhaka::Lajang:Bangladesh Betar:1/1/0001 12:00:00 AM::
8801515226813:100003027424231:Tarequl:Jewel:laki-laki:Dhaka:Barisal:Lajang:Student:1/1/0001 12:00:00 AM::09/21
8801515226683:100002281797181:Monir:Murad:laki-laki:Faridpur, Dhaka, Bangladesh:Rangpur, Bangladesh:Menikah:Diabetic Association Medical College Hospital:1/1/0001 12:00:00 AM::10/25
8801515231026:100022414033531:Mihnaf:Ahmed:laki-laki:Habiganj Sadar, Sylhet, Bangladesh:Habiganj Sadar, Sylhet, Bangladesh:Lajang:student:1/1/0001 12:00:00 AM::
8801515230569:100032746460801:Mahdi:Maruf:laki-laki:Dhaka:Jessore, Khulna, Bangladesh:Lajang:Department of International Relations, Jahangirnagar University:1/1/0001 12:00:00 AM::
8801515230554:100003140596648:Mussa:Ashraf:laki-laki:Sylhet:Kulaura, Sylhet, Bangladesh:Lajang:Nevadia Technology:1/1/0001 12:00:00 AM::03/17
8801515232035:100009218429153:Sultana:Rupa:perempuan:Patuakhali, Chittagong, Bangladesh:Patuakhali, Chittagong, Bangladesh:Menikah:Student:1/1/0001 12:00:00 AM::11/20/1994
8801515231740:100003398960869:Shah Md Minhajul:Abedin:laki-laki:Dhaka:Habiganj:Lajang:F.H Hall Debating Club-FHDC:1/1/0001 12:00:00 AM::
8801515234330:100010837128023:Tanvir:Pranta:laki-laki:Dhaka:Tangail:Lajang:B.B.A(Accounting & information system) at Jagannath University:1/1/0001 12:00:00 AM::04/07
8801515234094:100007593820188:Arifa Khan:Pial:perempuan:Dhaka:Tangail::Wishing Wings:1/1/0001 12:00:00 AM::04/29
8801515236127:100011717703553:Jakir:Hossain:laki-laki:::Lajang:CoKreates Ltd:1/1/0001 12:00:00 AM::
8801515238249:100002528517387:Nijum:Martin:laki-laki:Dhaka:Dhaka::Motion picture:1/1/0001 12:00:00 AM::10/03
8801515237623:100009878837896:Shamsun:Nahar:perempuan:Khulna:Jessore, Khulna, Bangladesh::Come For Road Child:1/1/0001 12:00:00 AM::
8801515237500:100003148707342:S M:Hasan:laki-laki:Khulna:Khulna:Rumit:Student:1/1/0001 12:00:00 AM::
8801515239463:100002977013589:MA:Nur Alam:laki-laki:Mirpur, Dhaka, Bangladesh:Dhaka::Bangladesh Railway:1/1/0001 12:00:00 AM::
8801515239135:100024835270849:Faisal Bin:Akber:laki-laki:Dhaka:Dhaka:Lajang:Hotel InterContinental Dhaka:1/1/0001 12:00:00 AM::
8801515239023:100003035843484:Md:Islam:laki-laki:Dhaka::Menikah:Beximco Fashions Ltd.:1/1/0001 12:00:00 AM:jahid.dhakabd@gmail.com:
8801515238981:100002551535722:Shawon:Abdullah:laki-laki::Mirpur, Dhaka, Bangladesh:Lajang:Student:1/1/0001 12:00:00 AM::02/01
8801515238819:100007065527350:Rai:Sr.:laki-laki:Dhaka::Rumit:Raihan Enterprise:1/1/0001 12:00:00 AM::
8801515238604:100003094725562:Sonjoy:Saha:laki-laki:Cox's Bazar:Tangail::Concern Worldwide:1/1/0001 12:00:00 AM::
8801515241543:100002799937799:Majaharul:Islam:laki-laki:Dhaka:Dhaka:Menikah:Opsonin Pharma Limited:1/1/0001 12:00:00 AM::
8801515241488:100002785281939:Md Farhad:Hossain:laki-laki:Dhaka:Rangpur, Bangladesh:Lajang:Student:1/1/0001 12:00:00 AM::
8801515241456:100002988896661:Hafizur Rahman:Jony:laki-laki:Dhaka:Sirajganj::Dream Academy:1/1/0001 12:00:00 AM:jony174du@gmail.com:11/17
8801515241400:100008789261604:MD Hasibul:Islam:laki-laki:Dhaka:Noakhali, Chittagong, Bangladesh:Lajang:Student:1/1/0001 12:00:00 AM::
8801515241353:100010181107408:Mohammad:Ahmed:laki-laki:Rupshi, Dhaka, Bangladesh:Dhaka::Rupshi New Model School & College:1/1/0001 12:00:00 AM::
8801515241116:100005757306043:Arup:Biswas:laki-laki:Dhaka:Dhaka:Lajang:Study at Dhaka University, Political Science:1/1/0001 12:00:00 AM::
8801515240801:100006980983312:Masud:Rana:laki-laki:Dhaka:Kushtia, Khulna, Bangladesh:Lajang:Student:1/1/0001 12:00:00 AM::
8801515240744:100002547082035:Raihan:Islam:laki-laki:Dhaka:Dhaka:Bertunangan:Shahjalal Islami Bank Ltd.:1/1/0001 12:00:00 AM::
8801515240657:100004157100417:Jisan Hossain:Jibon:laki-laki:Dhaka:Dhaka::Dutch-Bangla Bank Ltd:1/1/0001 12:00:00 AM::
8801515240470:100005597376624:Sabbir:Hossain:laki-laki:Dhaka:Comilla:Lajang::1/1/0001 12:00:00 AM::
8801515240258:100001789653439:Kawsar:Hoq:laki-laki:Dhaka:Feni, Barisal, Bangladesh:Lajang:BIRDEM Hospital:1/1/0001 12:00:00 AM::
8801515240235:100000425667907:Nasir:Ziko:laki-laki:Dhaka:Barisal:Lajang:Abul Khair & Company:1/1/0001 12:00:00 AM::
8801515240202:100006915605782:Jubayer:Sadik:laki-laki:Dhaka:Dhaka:Lajang:Marcos Mamba Studios:1/1/0001 12:00:00 AM::
8801515240091:100002261781411:Hridoy:Nur:laki-laki:Dhaka:Comilla:Lajang:Student:1/1/0001 12:00:00 AM::
8801515242807:100000571163053:Tasnimuzzaman:Romel:laki-laki:Dhaka:Magura, Khulna, Bangladesh:::1/1/0001 12:00:00 AM::04/26/1991
8801515242669:100009623523456:Abir:Abir:laki-laki:Dhaka:Dhaka:Lajang:Facebook:1/1/0001 12:00:00 AM::
8801515242633:100003765971243:Sadia:Ananya:perempuan:Dhaka:Mymensingh, Dhaka, Bangladesh::BSMRSTU:1/1/0001 12:00:00 AM::
8801515242580:715043087:Md.:Bari:laki-laki:Dhaka:Bogra:Menikah:Bangladesh House Building Finance Corporation:1/1/0001 12:00:00 AM::
8801515242504:100028086098694:Alan:Walker:laki-laki:Dhaka:Brahmanbaria, Chittagong, Bangladesh:Lajang:DUDS:1/1/0001 12:00:00 AM::
8801515242242:100004058479369:Saydul:Bashar:laki-laki:Dhaka:Satkhira, Khulna, Bangladesh:Lajang:University of Dhaka:1/1/0001 12:00:00 AM::
8801515242153:100002731358844:Md Shajjad:Hossin:laki-laki:Dhaka:Faridpur, Dhaka, Bangladesh:Menikah:National Finance Limited:1/1/0001 12:00:00 AM::
8801515242032:100000676259176:Amrit:Debnath:laki-laki:Chittagong:Chittagong:Lajang:Mercantile Bank Limited:1/1/0001 12:00:00 AM::
8801515242031:100034694222311:Glory:Das:perempuan:Dhaka:Dhaka:Menikah:NCC Bank Limited:1/1/0001 12:00:00 AM::
8801515244521:100000249178637:Niaz:Morshed:laki-laki:Dhaka:Gopalganj, Dhaka, Bangladesh::INFS, University of Dhaka:1/1/0001 12:00:00 AM::
8801515244122:100009274655829:Dipam:Chakma:laki-laki:Mirpur, Dhaka, Bangladesh:Rangamati, Chittagong, Bangladesh:Menjalin hubungan tanpa status:PRAN-RFL Group:1/1/0001 12:00:00 AM:dipamchakma93@gmail.com:
8801515244040:100003583881984:Zahedul:Islam:laki-laki:Dhaka:Brahmanbaria, Chittagong, Bangladesh:Lajang:United Commercial Bank Ltd.:1/1/0001 12:00:00 AM::
8801515243733:100003593242592:Syed:Kibria:laki-laki:Dhaka:Barisal:Lajang:ACNABIN Chartered Accountants:1/1/0001 12:00:00 AM::
8801515243665:100001313631440:Md. Habibur:Rahman:laki-laki:Dhaka:Comilla:Menikah:Department of International Relations, University of Dhaka:1/1/0001 12:00:00 AM::
8801515243453:100002355657723:Taufiq:Shilon:laki-laki:Dhaka::Lajang:Dhaka Medical College:1/1/0001 12:00:00 AM::
8801515243451:100014476627066:Abdullah:Asif:laki-laki:Dhaka:Chandpur, Chittagong, Bangladesh:Lajang:Bangladesh Air Force:1/1/0001 12:00:00 AM::
8801515243324:1375331671:Ruhul:Amin:laki-laki:Dhaka:Satkhira, Khulna, Bangladesh:Menikah:Department of Social Services - DSS:1/1/0001 12:00:00 AM::
8801515246019:100017047174269:Prianka:Urmi:perempuan:Dhaka:Comilla:Lajang::1/1/0001 12:00:00 AM::
8801515245893:100022296395645:Asif:Imran:laki-laki:Dhaka:Kushtia, Khulna, Bangladesh:Lajang:Huawei Technologies:1/1/0001 12:00:00 AM::
8801515245498:100002509296559:Abid:Hassan:laki-laki:Dhaka:Tangail:Lajang::1/1/0001 12:00:00 AM::05/05
8801515245314:100003890745177:Tareq:Rizbi:laki-laki:Dhaka:Kushtia, Khulna, Bangladesh::Dhakaiya Express:1/1/0001 12:00:00 AM::
8801515245085:100015483524953:Ejazul:Haque:laki-laki:Dhaka:Dhaka::DIRD Group:1/1/0001 12:00:00 AM::
8801515247570:100000787793423:Sajib:Piyal:laki-laki:Jatrabari, Dhaka, Bangladesh:Dhaka:Menikah:British American Tobacco Bangladesh Limited:1/1/0001 12:00:00 AM::10/08
8801515247175:100003246141649:Khondoker:Mahadi Hassan:laki-laki:Dhaka:Dhaka:Lajang:Western Ideal Institute (Wii):1/1/0001 12:00:00 AM::
8801515247076:100006467970918:Parsha:Rafi:laki-laki:Dhaka:Comilla:Lajang:Backspace:1/1/0001 12:00:00 AM::
8801515246863:100011183987951:Aminul:Nabil:laki-laki:Dhaka:Dhaka:Lajang:Sandesh360:1/1/0001 12:00:00 AM::11/07/1993
8801511000071:100000725915451:Atique:Morshed:laki-laki:Dhaka:Jamalpur, Dhaka, Bangladesh::Health Training Institute (HTI):1/1/0001 12:00:00 AM:atique_morshed@yahoo.com:
8801511007007:100016476875398:Sabrina Rahman:Riya:perempuan:Dhaka:Kushtia, Dhaka, Bangladesh:::1/1/0001 12:00:00 AM::09/28/2000
8801511006666:100007325222961:Siam:Rahman:laki-laki:Comilla::Lajang::1/1/0001 12:00:00 AM::10/14/2000
8801511100081:100007330531818:Hassan:Mahadi:laki-laki:Dhaka:Dhaka:Lajang:Josephite Eco Earth Club:1/1/0001 12:00:00 AM:hassanmahadi999@gmail.com:
8801511111121:706173428:Saiful:Islam:laki-laki:Venesia:Dhaka:::1/1/0001 12:00:00 AM:saifulbba2002@hotmail.com:08/02
8801511115252:100004233515328:Sheikh Shohidur:Rahman:laki-laki:Sylhet:Sylhet::Rahman & Associates Law Chamber,Sylhet.:1/1/0001 12:00:00 AM:sheikshohid@gmail.com:
8801511162000:100008603417186:Md Sagor:Ahmed:laki-laki:Dhaka::::1/1/0001 12:00:00 AM:sagornet000000@gmail.com:
8801511181863:100002245083769:Muhammad:A:laki-laki:::::1/1/0001 12:00:00 AM:muhammaduac@gmail.com:
8801511202265:1695583840:Mahfuz:Hasan:laki-laki:Hamilton, Ontario:Rangpur, Bangladesh:Bertunangan:BUTEX Computer Club:1/1/0001 12:00:00 AM::
8801511846300:100009483631831:Ruhul:Amin:laki-laki:Sylhet:Shyamnagar, Khulna, Bangladesh:Lajang:Sewing:1/1/0001 12:00:00 AM:mdruhulaminruhi@gmail.com:01/08/1998
8801515206806:100007009325020:Syed Nayeem:Hossain:male:Dhaka, Bangladesh:Dhaka, Bangladesh:Single:Delta Brac Housing Finance Corporation Ltd:1/1/0001 12:00:00 AM:nayeem2027@gmail.com:
8801515201624:100002611473026:Alamin:Shawon:laki-laki:Dhaka:Tangail:Rumit:Excel Structural Solutions:1/1/0001 12:00:00 AM:alamin3sk@yahoo.com:07/30/1997
8801515202434:100001914537788:Partha Sarathi:Roy:laki-laki:Gopalganj, Dhaka, Bangladesh:Pirojpur, Chittagong, Bangladesh:Lajang:BSMRSTU:1/1/0001 12:00:00 AM:psroy1443@gmail.com:
8801515204621:100000142350736:Atik:Islam:male:Sylhet:Brahmanbaria, Chittagong, Bangladesh:::1/1/0001 12:00:00 AM:atik_islam01@live.com:
8801515208553:100000576738477:Sumohan Hossain:Sumo:male:Dhaka, Bangladesh:Dhaka, Bangladesh:Married::1/1/0001 12:00:00 AM:sumophotoo@gmail.com:
8801515209469:1187352303:Zahin:Tawsif:male::::MGH group:1/1/0001 12:00:00 AM:zahintawsif@yahoo.com:
8801515209279:100004563618115:Anik:Topadar:male:Dhaka, Bangladesh:Munshiganj, Dhaka, Bangladesh:Single:VIP ACCOUNTs:1/1/0001 12:00:00 AM:aniktopadarapu@gmail.com:
8801515208982:100010406048341:M A Kaium:Hossain:male:Narayanganj:Comilla:Single:Student life:1/1/0001 12:00:00 AM:abdulkaiumhossain7@gmail.com:01/01/1998
8801515208657:100003584148294:Imran:Sagar:male:Dhaka, Bangladesh:Gazipur, Dhaka, Bangladesh:It's complicated:Rinomas Distribution:1/1/0001 12:00:00 AM:imranhs231@gmail.com:04/08/1993
8801515211388:100007523620491:Sharif:Shahriar:male:Dhaka, Bangladesh:Dhaka, Bangladesh:Single:University of Dhaka:1/1/0001 12:00:00 AM:sharifdupa@gmail.com:03/02/1994
8801515210405:100011950711889:Siam:Shafi:male:Dhaka, Bangladesh:Mirpur, Dhaka, Bangladesh:Single:BIHRM:1/1/0001 12:00:00 AM:lzshiam@gmail.com:
8801515212481:100001124415949:Shakib:Nahian::Mirpur, Dhaka, Bangladesh:Dhaka, Bangladesh:Single:Bangladesh National Cadet Corps:1/1/0001 12:00:00 AM:shakib821@gmail.com:11/06/1996
8801515218008:100008076151370:Masud:Erdogan:male:Dhaka, Bangladesh:Kalukhali, Dhaka, Bangladesh:Single:Student of Rajshahi University:1/1/0001 12:00:00 AM:masudrana.ru31@gmail.com:12/06
8801515284432:100011270593571:Ummey:Shanto:female:Chittagong:Chittagong:Single::1/1/0001 12:00:00 AM:habiba56cu@gmail.com:
8801515287317:100009763804213:Shaqeeb:Iftekhar:male:Chittagong:Chittagong::FEL-Samsung:1/1/0001 12:00:00 AM:iftekharsakib23@gmail.com:
8801515286684:100007705964371:FA:Rul:male:Chittagong:Comilla::University of Chittagong:1/1/0001 12:00:00 AM:fakhrulahmed111@gmail.com:
8801515288495:100002485127302:Sagar:Das:male:Dhaka, Bangladesh:Narsingdi, Dhaka, Bangladesh:Single::1/1/0001 12:00:00 AM:sagar420583@gmail.com:
8801515292260:100007945590809:S:Sarkar:male:Dhaka, Bangladesh::::1/1/0001 12:00:00 AM:samy.jnu@gmail.com:`;

export const RAW_DATABASE_ENTRIES: string[] = RAW_DATABASE_TEXT
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('#'));

/**
 * Parses a colon-delimited raw database string into a structured ContactRecord
 * e.g. Phone:UID:First:Last:Gender:City:Hometown:Relationship:Work:Birthday:Email:Extra
 */
export function parseRawDbLine(line: string, index = 0): ContactRecord | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  // Protect internal colons in time strings like "12:00:00 AM" so they don't corrupt field indices
  const sanitizedLine = trimmed.replace(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/gi, '$1.$2.$3 $4');
  const parts = sanitizedLine.split(':');
  if (parts.length < 3) return null;

  const phone = parts[0]?.trim() || '';
  const fbUid = parts[1]?.trim() || '';
  const firstName = parts[2]?.trim() || '';
  const lastName = parts[3]?.trim() || '';
  const gender = parts[4]?.trim() || '';
  const city = parts[5]?.trim() || '';
  const hometown = parts[6]?.trim() || '';
  const relationshipStatus = parts[7]?.trim() || '';
  const work = parts[8]?.trim() || '';
  
  // Scan remaining fields for real email and birthday
  let email = '';
  let birthday = '';

  for (let i = 9; i < parts.length; i++) {
    const val = parts[i]?.trim();
    if (!val) continue;

    // Check if email
    if (val.includes('@') && !email) {
      email = val;
      continue;
    }

    // Check if real birthday (e.g. 01/23/1996, 12/08/1991, 06/18, 08/15, 01/01)
    // Filter out zero-dates (0001) and time flags
    if (
      !val.includes('0001') &&
      !val.toLowerCase().includes('am') &&
      !val.toLowerCase().includes('pm') &&
      /^\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?$/.test(val)
    ) {
      birthday = val;
    }
  }

  // Fallback check on parts[9] if date is not zero-date
  if (!birthday && parts[9]) {
    const candidate = parts[9].trim().split(' ')[0];
    if (candidate && !candidate.includes('0001') && /^\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?$/.test(candidate)) {
      birthday = candidate;
    }
  }

  const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';
  const banglaName = fullName.toLowerCase().includes('ehsan') 
    ? 'এহসান অনল' 
    : undefined;

  const operatorInfo = detectBdOperator(phone);

  return {
    id: `raw-rec-${fbUid || phone}-${index}`,
    name: fullName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    banglaName: banglaName,
    phone: phone,
    fbUid: fbUid,
    fbUsername: firstName ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}` : undefined,
    fbProfileUrl: `https://facebook.com/${fbUid}`,
    gender: gender || undefined,
    city: city || undefined,
    hometown: hometown || undefined,
    location: [city, hometown].filter(Boolean).join(', ') || (city ? city : 'Dhaka, Bangladesh'),
    relationshipStatus: relationshipStatus || undefined,
    work: work || undefined,
    occupation: work || undefined,
    birthday: birthday || undefined,
    email: email || undefined,
    rawDbLine: trimmed,
    isVerified: true,
    operator: operatorInfo.name,
    createdAt: new Date().toISOString(),
    tags: ['FB Database Record', 'Verified Entry']
  };
}

/**
 * Builds the raw database colon string from a ContactRecord
 */
export function buildRawDbLine(record: ContactRecord): string {
  if (record.rawDbLine) return record.rawDbLine;

  const first = record.firstName || record.name.split(' ')[0] || '';
  const last = record.lastName || record.name.split(' ').slice(1).join(' ') || '';
  const gender = record.gender || 'laki-laki';
  const city = record.city || record.location?.split(',')[0]?.trim() || '';
  const hometown = record.hometown || '';
  const relation = record.relationshipStatus || 'Lajang';
  const work = record.work || record.occupation || '';
  const bday = record.birthday || '1/1/0001 12:00:00 AM';
  const email = record.email || '';

  return `${record.phone}:${record.fbUid}:${first}:${last}:${gender}:${city}:${hometown}:${relation}:${work}:${bday}:${email}:`;
}

/**
 * Load all default records from the raw entries
 */
export function getInitialRecordsFromRaw(): ContactRecord[] {
  return RAW_DATABASE_ENTRIES
    .map((line, idx) => parseRawDbLine(line, idx))
    .filter((rec): rec is ContactRecord => rec !== null);
}
