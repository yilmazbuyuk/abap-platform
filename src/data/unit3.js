export const unit3 = [
  {
    id: "u3-l1",
    tcode: "SE38",
    title: "1. Metin Birleştirme (CONCATENATE)",
    desc: "Ayrı ayrı duran metin değişkenlerini yan yana ekleme, araya ayraç koyma ve modern yöntemler.",
    code: `REPORT z_ders_u3_1_concatenate.

START-OF-SELECTION.
* ======================================================================
* 1. DEĞİŞKEN TANIMLAMA VE DEĞER ATAMA
* ======================================================================
  DATA: lv_ad    TYPE string,
        lv_soyad TYPE string,
        lv_unvan TYPE string,
        lv_sonuc TYPE string.

  lv_ad    = 'Yılmaz'.
  lv_soyad = 'Çevik'.
  lv_unvan = 'Uzman'.

  WRITE: '✍️ ABAP METİN BİRLEŞTİRME REHBERİ'.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* 2. KLASİK YÖNTEM (CONCATENATE)
* CONCATENATE komutu, verilen metinleri sırasıyla birbirine yapıştırır.
* Herhangi bir ayraç kullanmazsak kelimeler bitişik yazılır.
* ======================================================================
  
  CONCATENATE lv_unvan lv_ad lv_soyad INTO lv_sonuc.
  
  WRITE: / 'Bitişik Hali        :', lv_sonuc.

* ======================================================================
* 3. AYRAÇ KULLANMA (SEPARATED BY)
* Kelimelerin arasına boşluk (space), tire (-) veya virgül (,) gibi
* herhangi bir karakter koymak için SEPARATED BY komutu eklenir.
* ======================================================================
  
  " Araya boşluk (space) koyarak birleştirme
  CONCATENATE lv_unvan lv_ad lv_soyad 
         INTO lv_sonuc 
         SEPARATED BY space.
  
  WRITE: / 'Boşluklu Hali       :', lv_sonuc.

  " Araya tire (-) koyarak birleştirme
  CONCATENATE lv_unvan lv_ad lv_soyad 
         INTO lv_sonuc 
         SEPARATED BY '-'.

  WRITE: / 'Tireli Hali         :', lv_sonuc.

* ======================================================================
* 4. MODERN ABAP YÖNTEMİ: STRING TEMPLATES (BONUS)
* Yeni nesil SAP sistemlerinde artık CONCATENATE komutu yerine, 
* tıpkı modern web dillerinde olduğu gibi çok daha pratik olan 
* dik çizgi (Pipe: | ) yöntemi kullanılır.
*
* Kural: Sabit metinler dışarıda, değişkenler { } parantezleri 
* içinde yazılır.
* ======================================================================
  WRITE: / '--------------------------------------------------'.
  
  " İstediğimiz gibi aralara kelimeler ve noktalama işaretleri koyabiliriz!
  lv_sonuc = |Sayın { lv_unvan } { lv_ad } { lv_soyad }, sisteme hoş geldiniz!|.
  
  WRITE: / 'Modern Yöntem (|) :', lv_sonuc.`,
  },
  {
    id: "u3-l2",
    tcode: "SE38",
    title: "2. Metin Parçalama (SPLIT)",
    desc: "Bir cümleyi veya kelimeyi belirli bir ayraçtan (karakterden) bölüp değişkenlere veya tablolara aktarmak.",
    code: `REPORT z_ders_u3_2_split.

START-OF-SELECTION.
* ======================================================================
* 1. TEMEL PARÇALAMA (DEĞİŞKENLERE BÖLME)
* Bir metni belirli bir karakterden (ayraç) bölüp, parçaları
* sırasıyla farklı değişkenlerin içine atabiliriz.
* ======================================================================
  DATA: lv_eposta    TYPE string VALUE 'iletisim@abapakademi.com',
        lv_kullanici TYPE string,
        lv_domain    TYPE string.

  WRITE: '✂️ ABAP METİN PARÇALAMA (SPLIT) REHBERİ'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Orijinal E-Posta: { lv_eposta }|.

  " AT '@' komutu, metni @ işaretinin olduğu yerden bıçak gibi keser.
  " İlk parça lv_kullanici değişkenine, ikinci parça lv_domain'e gider.
  SPLIT lv_eposta AT '@' INTO lv_kullanici lv_domain.

  WRITE: / |Kullanıcı Adı   : { lv_kullanici }|.
  WRITE: / |Mail Sunucusu   : { lv_domain }|.

* ======================================================================
* 2. İKİDEN FAZLA PARÇAYA BÖLME (BİRDEN ÇOK DEĞİŞKEN)
* ======================================================================
  DATA: lv_ad_soyad TYPE string VALUE 'Ali Veli Yılmaz',
        lv_ad1      TYPE string,
        lv_ad2      TYPE string,
        lv_soyad    TYPE string.

  WRITE: /.
  WRITE: / '--- BİRDEN FAZLA PARÇAYA BÖLME ---'.
  
  " Araya boşluk (space) geldiği her yerden kesiyoruz.
  SPLIT lv_ad_soyad AT space INTO lv_ad1 lv_ad2 lv_soyad.
  
  WRITE: / |Tam İsim : { lv_ad_soyad }|.
  WRITE: / |1. Ad    : { lv_ad1 }|.
  WRITE: / |2. Ad    : { lv_ad2 }|.
  WRITE: / |Soyad    : { lv_soyad }|.

* ======================================================================
* 3. İLERİ SEVİYE: TABLOYA BÖLME (INTO TABLE)
* Gerçek projelerde (örneğin dışarıdan virgüllü CSV dosyası okurken)
* metnin içinde kaç parça olduğunu bilemeyiz (10 parça da olabilir, 50 de).
* Bu durumda veriyi tek tek değişkenlere değil, tek hamlede bir 
* TABLOYA (Liste) atarız.
* ======================================================================
  DATA: lv_csv_satiri TYPE string VALUE 'Elma,Armut,Muz,Çilek,Karpuz',
        lt_meyveler   TYPE TABLE OF string,  " Metin tutan bir tablo
        lv_meyve      TYPE string.

  WRITE: /.
  WRITE: / '--- VİRGÜLLÜ METNİ TABLOYA ÇEVİRME (CSV) ---'.
  WRITE: / |Orijinal Satır: { lv_csv_satiri }|.
  

  " Virgül (,) gördüğün her yerden kes ve yeni bir satır olarak tabloya ekle!
  SPLIT lv_csv_satiri AT ',' INTO TABLE lt_meyveler.

  WRITE: / 'Oluşan Tablonun İçeriği:'.
  
  " Tabloyu LOOP ile ekrana basalım (Önceki ünitelerde öğrenmiştik)
  LOOP AT lt_meyveler INTO lv_meyve.
    WRITE: / |{ sy-tabix }. Meyve: { lv_meyve }|.
  ENDLOOP.`,
  },
  {
    id: "u3-l3",
    tcode: "SE38",
    title: "3. Karakter Sayma ve Konum (STRLEN & OFFSET)",
    desc: "Metnin uzunluğunu bulmak ve Offset (+Konum(Uzunluk)) mantığıyla metnin sadece belirli bir bölümünü çekip almak.",
    code: `REPORT z_ders_u3_3_offset.

START-OF-SELECTION.
* ======================================================================
* 1. DEĞİŞKEN TANIMLAMA (TARİH FORMATI)
* SAP veritabanında tarihler her zaman 8 haneli bitişik bir metin
* veya 'd' (Date) tipi olarak YYYYAAGG (YılAyGün) formatında tutulur.
* ======================================================================
  DATA: lv_tarih   TYPE string VALUE '20231025', " 25 Ekim 2023
        lv_uzunluk TYPE i,
        lv_yil     TYPE string,
        lv_ay      TYPE string,
        lv_gun     TYPE string.

  WRITE: '📏 ABAP METİN UZUNLUĞU VE OFFSET REHBERİ'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Orijinal Veri (Veritabanı Formatı): { lv_tarih }|.

* ======================================================================
* 2. UZUNLUK BULMA (STRLEN)
* strlen() fonksiyonu bir metnin içinde kaç karakter olduğunu sayar.
* ======================================================================
  lv_uzunluk = strlen( lv_tarih ).
  
  WRITE: /.
  WRITE: / |Karakter Sayısı (STRLEN): { lv_uzunluk } hane|.

* ======================================================================
* 3. OFFSET MANTIĞI (METNİN İÇİNDEN PARÇA ÇEKME)
* ABAP'ta indeks her zaman 0'dan başlar!
* Format: degisken+BaslangicKonumu(KacKarakterAlinacak)
*
* Harita:  2  0  2  3  1  0  2  5
* İndeks:  0  1  2  3  4  5  6  7
* ======================================================================
  [Image of ABAP string offset and length indexing]
  WRITE: /.
  WRITE: / '--- OFFSET İLE TARİHİ PARÇALAMA ---'.

  " 0. indeksten (en baştan) başla, sağa doğru 4 karakter al
  lv_yil = lv_tarih+0(4). " Sonuç: 2023
  
  " 4. indeksten başla, sağa doğru 2 karakter al
  lv_ay  = lv_tarih+4(2). " Sonuç: 10
  
  " 6. indeksten başla, sağa doğru 2 karakter al
  lv_gun = lv_tarih+6(2). " Sonuç: 25

  WRITE: / |Bölünen Parçalar -> Yıl: { lv_yil } - Ay: { lv_ay } - Gün: { lv_gun }|.
  WRITE: / |Ekranda Gösterim -> { lv_gun }.{ lv_ay }.{ lv_yil }|.

* ======================================================================
* 4. METİN İÇİNDE DEĞİŞTİRME YAPMA (REPLACE)
* İstediğimiz bir kelimeyi veya karakter kümesini bulup başka bir 
* şeyle değiştirmek için kullanılır.
* ======================================================================
  WRITE: /.
  WRITE: / '--- REPLACE (DEĞİŞTİRME) İŞLEMİ ---'.

  " Diyelim ki tarihi güncel yıla (2026) çekmek istiyoruz.
  REPLACE '2023' IN lv_tarih WITH '2026'.
  
  WRITE: / |Yeni Tarih (Güncellenmiş): { lv_tarih }|.
  
  " Başka bir örnek: Ayraçları değiştirelim
  DATA: lv_telefon TYPE string VALUE '0555-123-45-67'.
  WRITE: / |Orijinal Telefon: { lv_telefon }|.
  
  " ALL OCCURRENCES OF komutu, bulduğu tüm eşleşmeleri değiştirir
  REPLACE ALL OCCURRENCES OF '-' IN lv_telefon WITH ' '.
  WRITE: / |Boşluklu Telefon: { lv_telefon }|.`,
  },
  {
    id: "u3-l4",
    tcode: "SE38",
    title: "4. Temizleme ve Dönüştürme (CONDENSE & TRANSLATE)",
    desc: "Metinlerdeki gereksiz boşlukları silme (CONDENSE) ve büyük/küçük harf standardizasyonu (TRANSLATE).",
    code: `REPORT z_ders_u3_4_condense.

START-OF-SELECTION.
* ======================================================================
* 1. VERİ TEMİZLEME (CONDENSE)
* Dışarıdan gelen verilerde genellikle gereksiz boşluklar bulunur. 
* CONDENSE komutu metnin en başındaki ve en sonundaki boşlukları tamamen
* siler. Kelimeler arasındaki gereksiz boşlukları ise TEK bir boşluğa indirger.
* ======================================================================
  DATA: lv_kirli TYPE string VALUE '   SAP    ABAP    Ogreniyorum   ',
        lv_temiz TYPE string.

  WRITE: '🧹 ABAP METİN TEMİZLEME VE DÖNÜŞTÜRME'.
  WRITE: / '--------------------------------------------------'.
  
  " Boşlukları net görmek için köşeli parantez [ ] içine alıyoruz
  WRITE: / |Orijinal Kirli Veri : [{ lv_kirli }]|.

  " lv_kirli'yi bozmamak için kopyasını alıp onun üzerinde çalışalım
  lv_temiz = lv_kirli.
  CONDENSE lv_temiz.

  WRITE: / |CONDENSE Edilmiş Hali: [{ lv_temiz }]|.
  " Çıktı: [SAP ABAP Ogreniyorum] (Aralarda sadece tek boşluk kaldı)

* ======================================================================
* 2. TÜM BOŞLUKLARI SİLME (NO-GAPS)
* Eğer IBAN, Telefon Numarası, Barkod veya TC Kimlik No gibi verilerin
* içindeki TÜM boşlukları yok etmek istiyorsak NO-GAPS eklentisi kullanırız.
* ======================================================================
  DATA: lv_iban TYPE string VALUE 'TR12 3456 7890 1234 5678 90'.

  WRITE: /.
  WRITE: / '--- NO-GAPS (TÜM BOŞLUKLARI YOK ET) ---'.
  WRITE: / |Orijinal IBAN: { lv_iban }|.

  " Metindeki tüm boşlukları acımasızca siler
  CONDENSE lv_iban NO-GAPS.

  WRITE: / |Temiz IBAN   : { lv_iban }|.

* ======================================================================
* 3. BÜYÜK / KÜÇÜK HARFE ÇEVİRME (TRANSLATE)
* Veritabanında arama yaparken ('Ahmet' veya 'AHMET') büyük/küçük harf 
* duyarlılığından kurtulmak için metinleri standartlaştırmak gerekir.
* ======================================================================
  DATA: lv_isim TYPE string VALUE 'yILmAz çEVik'.

  WRITE: /.
  WRITE: / '--- TRANSLATE (BÜYÜK/KÜÇÜK HARF DÖNÜŞÜMÜ) ---'.
  WRITE: / |Orijinal İsim: { lv_isim }|.

  " Hepsini BÜYÜK harf yap (TO UPPER CASE)
  TRANSLATE lv_isim TO UPPER CASE.
  WRITE: / |Büyük Harf   : { lv_isim }|.

  " Hepsini KÜÇÜK harf yap (TO LOWER CASE)
  TRANSLATE lv_isim TO LOWER CASE.
  WRITE: / |Küçük Harf   : { lv_isim }|.

* ======================================================================
* 4. MODERN ABAP İPUCU (BONUS)
* Yeni nesil S/4HANA sistemlerinde bu işlemler satır satır komut yerine,
* tıpkı diğer modern dillerdeki gibi fonksiyonlarla tek satırda yapılabilir:
* * lv_isim = to_upper( condense( val = lv_kirli ) ).
* ======================================================================
  [Image of ABAP CONDENSE and TRANSLATE string functions]`,
  },
  {
    id: "u3-l5",
    tcode: "SE38",
    title: "5. Bul ve Değiştir (FIND & REPLACE)",
    desc: "Uzun bir metnin içinde belirli bir kelimeyi aramak (FIND) ve onu başka bir metinle değiştirmek (REPLACE).",
    code: `REPORT z_ders_u3_5_find_replace.

START-OF-SELECTION.
* ======================================================================
* 1. ARAMA YAPMA (FIND KOMUTU)
* FIND komutu metni değiştirmez, sadece aradığınız kelimenin o metnin
* içinde geçip geçmediğini kontrol eder. Sonucu yine meşhur sistem 
* değişkenimiz "sy-subrc" ile öğreniriz. (0 = Bulundu, 4 = Bulunamadı)
* ======================================================================
  DATA: lv_log_mesaji TYPE string VALUE 'Sistem Durumu: Kritik HATA oluştu! Kullanıcı bulunamadı.',
        lv_hayvanlar  TYPE string VALUE 'Kedi, kedi, kedi... Her yer kedi!'.

  WRITE: '🔍 ABAP METİN ARAMA VE DEĞİŞTİRME'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Orijinal Log Mesajı: { lv_log_mesaji }|.
  WRITE: /.

  " Metnin içinde 'HATA' kelimesi geçiyor mu?
  [Image of ABAP FIND and REPLACE string operations]
  FIND 'HATA' IN lv_log_mesaji.
  
  IF sy-subrc = 0.
    WRITE: / '🚨 UYARI: Sistem loglarında "HATA" kelimesi tespit edildi!'.
  ELSE.
    WRITE: / '✅ SİSTEM TEMİZ: Herhangi bir hata bulunamadı.'.
  ENDIF.

* ======================================================================
* 2. DEĞİŞTİRME İŞLEMİ (REPLACE)
* Bulunan bir metni başka bir metinle değiştirmek için kullanılır.
* Sadece 'REPLACE' yazarsak, bulduğu İLK eşleşmeyi değiştirir.
* ======================================================================
  WRITE: /.
  WRITE: / '--- REPLACE (İLK KAYDI DEĞİŞTİRME) ---'.

  " Mesajdaki ilk 'HATA' kelimesini 'UYARI' ile değiştirelim.
  REPLACE 'HATA' IN lv_log_mesaji WITH 'UYARI'.

  WRITE: / |Güncel Log Mesajı: { lv_log_mesaji }|.
  
* ======================================================================
* 3. TOPLU DEĞİŞTİRME (ALL OCCURRENCES OF) VE BÜYÜK/KÜÇÜK HARF DUYARSIZLIĞI
* Metin içindeki TÜM eşleşmeleri değiştirmek için ALL OCCURRENCES OF kullanırız.
* Bonus: IGNORING CASE eklersek, büyük/küçük harf ayrımı yapmadan hepsini bulur.
* ======================================================================
  WRITE: /.
  WRITE: / '--- TOPLU DEĞİŞİM (ALL OCCURRENCES) ---'.
  WRITE: / |Orijinal Metin: { lv_hayvanlar }|.

  " IGNORING CASE sayesinde 'Kedi' veya 'kedi' fark etmeksizin hepsini 'Köpek' yapar.
  REPLACE ALL OCCURRENCES OF 'Kedi' IN lv_hayvanlar WITH 'Köpek' IGNORING CASE.
  
  WRITE: / |Toplu Değişim Sonrası: { lv_hayvanlar }|.`,
  },
  {
    id: "u3-l6",
    tcode: "SE38",
    title: "6. Matematiksel Fonksiyonlar (ABS, FLOOR, CEIL)",
    desc: "Ondalıklı sayıları yuvarlama (FLOOR/CEIL), mutlak değer alma (ABS) ve kalan bulma (MOD) işlemleri.",
    code: `REPORT z_ders_u3_6_matematik.

START-OF-SELECTION.
* ======================================================================
* 1. DEĞİŞKEN TANIMLAMALARI
* p (Packed) tipi ondalıklı sayılar, i (Integer) tipi tam sayılar içindir.
* ======================================================================
  DATA: lv_ondalikli TYPE p DECIMALS 2 VALUE '-15.75', " Negatif küsuratlı sayı
        lv_tam_sayi  TYPE i,
        lv_kalan     TYPE i.

  WRITE: '🧮 ABAP MATEMATİKSEL FONKSİYONLAR'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Orijinal Sayı (Veritabanından Gelen): { lv_ondalikli }|.

* ======================================================================
* 2. MUTLAK DEĞER (ABS - Absolute)
* Bir sayının sıfıra olan uzaklığıdır. Negatif sayıyı pozitife çevirir.
* Gerçek Hayat: SAP FI (Finans) modülünde eksi bakiyeli borç tutarlarını 
* ekranda veya faturada pozitif göstermek için her gün kullanılır.
* ======================================================================
  WRITE: /.
  WRITE: / '--- 1. MUTLAK DEĞER (ABS) ---'.

  lv_ondalikli = abs( lv_ondalikli ). " -15.75 -> 15.75 oldu

  WRITE: / |abs( -15.75 ) İşleminin Sonucu : { lv_ondalikli }|.

* ======================================================================
* 3. AŞAĞI VE YUKARI YUVARLAMA (FLOOR & CEIL)
* FLOOR (Zemin) : Sayıyı her zaman kendinden KÜÇÜK en yakın tam sayıya çeker.
* CEIL  (Tavan) : Sayıyı her zaman kendinden BÜYÜK en yakın tam sayıya çeker.
* ======================================================================
  [Image of mathematical rounding functions FLOOR and CEIL in programming]
  WRITE: /.
  WRITE: / '--- 2. YUVARLAMA (FLOOR & CEIL) ---'.

  " Küsurat ne olursa olsun tabana (15'e) yuvarlar.
  lv_tam_sayi = floor( lv_ondalikli ).
  WRITE: / |Tabana Yuvarla (FLOOR)  : { lv_tam_sayi }|.

  " Küsurat ne olursa olsun tavana (16'ya) yuvarlar. 
  " Gerçek Hayat: 15.75 metreküp ürün için 16 adet tır sipariş etmek gibi!
  lv_tam_sayi = ceil( lv_ondalikli ).
  WRITE: / |Tavana Yuvarla (CEIL)   : { lv_tam_sayi }|.

* ======================================================================
* 4. KALAN BULMA (MOD) - İLERİ SEVİYE KULLANIM
* Bölme işleminden kalanı verir.
* Gerçek Hayat: ALV raporlarında satırları bir gri bir beyaz (Zebra) 
* yapmak için döngü içinde (sy-tabix MOD 2) formülü kullanılır.
* ======================================================================
  WRITE: /.
  WRITE: / '--- 3. KALAN BULMA (MOD) ---'.

  " 10'un içinde 3, 3 kere var (3x3=9). Kalan: 1
  lv_kalan = 10 MOD 3. 

  WRITE: / |10 MOD 3 İşleminin Kalanı: { lv_kalan }|.`,
  },
];
