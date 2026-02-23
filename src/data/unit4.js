export const unit4 = [
  {
    id: "u4-l1",
    tcode: "SE38",
    title: "1. Alt Programlar (Subroutines - FORM)",
    desc: "Kod tekrarını önlemek ve programı okunabilir parçalara (metotlara) bölmek.",
    code: `REPORT z_ders_u4_1_form.

* ======================================================================
* 1. GLOBAL DEĞİŞKENLER (Global Variables)
* Önceki derslerde hep "lv_" (Local Variable - Yerel Değişken) kullanmıştık. 
* Burada ise "gv_" (Global Variable) kullanıyoruz. Global değişkenlere 
* programın her yerinden (ana akıştan ve en alttaki alt programlardan) 
* doğrudan erişilebilir.
* ======================================================================
DATA: gv_s1    TYPE i,
      gv_s2    TYPE i,
      gv_sonuc TYPE i.

START-OF-SELECTION.
  WRITE: '🧩 ABAP MODÜLERLEŞTİRME (PERFORM / FORM)'.
  WRITE: / '--------------------------------------------------'.

  " Değişkenlere başlangıç değerlerini atıyoruz
  gv_s1 = 15.
  gv_s2 = 5.

  WRITE: / |İşlem Yapılacak Sayılar: { gv_s1 } ve { gv_s2 }|.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* 2. ALT PROGRAM ÇAĞIRMA (PERFORM)
* PERFORM komutu, programın yukarıdan aşağıya doğru inen akışını durdurur, 
* aşağıdaki ilgili FORM bloğuna atlar, oradaki kodları çalıştırır ve 
* işi bitince kaldığı yere geri döner.
* ======================================================================
  
  " 1. Toplama işlemi için alt programı (bloğu) çağır
  PERFORM topla.
  WRITE: / 'Toplama İşleminin Sonucu :', gv_sonuc.

  " 2. Çıkarma işlemi için alt programı çağır
  PERFORM cikar.
  WRITE: / 'Çıkarma İşleminin Sonucu :', gv_sonuc.

  WRITE: / '--------------------------------------------------'.
  WRITE: / '✅ Program ana akışı tamamlandı.'.

* ======================================================================
* 3. ALT PROGRAM TANIMLAMALARI (FORM ... ENDFORM)
* Alt programlar, ana kod akışını (START-OF-SELECTION) kalabalıklaştırmamak 
* için geleneksel olarak kodun en altına yazılır.
*
* Not: Modern ABAP'ta FORM yapısı yerine Sınıflar (CLASS) ve Metotlar 
* (METHOD) kullanılır. Ancak eski SAP raporlarında ve standart kullanıcı 
* çıkışlarında (User Exits) FORM yapısı hala çok yaygın kullanılmaktadır.
* ======================================================================

FORM topla.
  " Bu blok dışarıdaki gv_s1 ve gv_s2'yi okur, sonucu gv_sonuc içine yazar.
  gv_sonuc = gv_s1 + gv_s2.
ENDFORM.

FORM cikar.
  gv_sonuc = gv_s1 - gv_s2.
ENDFORM.`,
  },
  {
    id: "u4-l2",
    tcode: "SE24",
    title: "2. Class ve Method (OOP Temelleri)",
    desc: "Nesne Yönelimli Programlamaya (OOP) giriş. İlk yerel sınıfımızı (Local Class) ve nesnemizi (Object) oluşturuyoruz.",
    code: `REPORT z_ders_u4_2_oop_temel.



* ======================================================================
* 1. SINIF TANIMI (CLASS ... DEFINITION) - "Mimarın Çizimi"
* Sınıf (Class) bir şablondur, kalıptır. Ortada henüz canlı bir şey yoktur.
* Burada "Bir insanın ne gibi özellikleri (Attributes) ve yetenekleri 
* (Methods) olmalıdır?" sorusunun cevabını tanımlarız.
* ======================================================================
CLASS lcl_insan DEFINITION.
  PUBLIC SECTION. " Herkesin erişebileceği (Açık) alan
    
    " Özellikler (Attributes - Veriler)
    DATA: ad  TYPE string,
          yas TYPE i.

    " Yetenekler (Methods - Yapabileceği işler)
    METHODS: konus,
             bilgi_ver.
ENDCLASS.

* ======================================================================
* 2. SINIF UYGULAMASI (CLASS ... IMPLEMENTATION) - "Fabrika"
* Yukarıda tanımladığımız yeteneklerin "Nasıl" çalışacağını burada yazarız.
* ======================================================================
CLASS lcl_insan IMPLEMENTATION.
  
  METHOD konus.
    WRITE: / '🗣️ Merhaba! Ben kodlanmış sanal bir insanım.'.
  ENDMETHOD.

  METHOD bilgi_ver.
    WRITE: /.
    WRITE: |👤 Benim adım { ad } ve ben { yas } yaşındayım.|.
  ENDMETHOD.

ENDCLASS.

* ======================================================================
* 3. ANA PROGRAM (OBJECT CREATION)
* Kalıptan gerçek bir ürün (Nesne/Object) yaratma zamanı!
* ======================================================================
START-OF-SELECTION.

  WRITE: '🧱 ABAP OOP: SINIFLAR VE NESNELER'.
  WRITE: / '--------------------------------------------------'.

  " 1. Referans Tanımlama (TYPE REF TO)
  " lo_insan (Local Object), lcl_insan kalıbından üretilecek bir nesnedir.
  DATA: lo_insan TYPE REF TO lcl_insan.

  " 2. Nesneyi Hafızada Yaratma (Doğum anı!)
  " Bu kod çalışana kadar lo_insan boştur. CREATE OBJECT ile hafızada yer açılır.
  CREATE OBJECT lo_insan.

  " 3. Özellikleri Doldurma (Tire-Büyüktür '->' İşareti)
  " Nesnenin içindeki verilere ulaşmak için ok (->) işareti kullanılır.
  lo_insan->ad  = 'Ahmet'.
  lo_insan->yas = 28.

  " 4. Metotları (Yetenekleri) Çağırma
  " Eski SAP versiyonlarında CALL METHOD lo_insan->konus. şeklinde yazılırdı.
  " Modern ABAP'ta sadece metot adının sonuna () koymak yeterlidir!
  lo_insan->konus( ).
  lo_insan->bilgi_ver( ).`,
  },
  {
    id: "u4-l3",
    tcode: "SE24",
    title: "3. Parametreli Metotlar (IMPORTING)",
    desc: "Metotları birer 'Kara Kutu' gibi kullanmak: Dışarıdan veri göndermek (IMPORTING) ve işlem sonucunu geri almak (RETURNING).",
    code: `REPORT z_ders_u4_3_oop_param.

* ======================================================================
* 1. SINIF TANIMI (METHODS İLE PARAMETRE KULLANIMI)
* Metotları birer "kara kutu" veya makine gibi düşünmeliyiz. İçine 
* hammadde (IMPORTING) atarız, o bize işlenmiş bir ürün (RETURNING) verir.
*
* İsimlendirme Standartları (Çok Önemli!):
* iv_ : Importing Variable (İçeri Alınan Değer)
* ev_ : Exporting Variable (Dışarı Çıkarılan Değer)
* rv_ : Returning Variable (Geri Döndürülen Tekil Sonuç)
* ======================================================================
CLASS lcl_matematik DEFINITION.
  PUBLIC SECTION.
    
    " IMPORTING: Metodu çağırırken ona vermemiz ZORUNLU olan değerler.
    " RETURNING: Metodun işi bitince bize tek bir sonuç olarak vereceği değer.
    METHODS: topla
               IMPORTING iv_sayi1 TYPE i
                         iv_sayi2 TYPE i
               RETURNING VALUE(rv_sonuc) TYPE i.

ENDCLASS.

* ======================================================================
* 2. SINIF UYGULAMASI (IMPLEMENTATION)
* Kara kutunun içinde (makinenin motorunda) neler olduğunu yazıyoruz.
* ======================================================================
CLASS lcl_matematik IMPLEMENTATION.
  
  METHOD topla.
    " Dışarıdan gelen iv_sayi1 ve iv_sayi2'yi toplayıp,
    " dışarıya çıkacak olan rv_sonuc değişkeninin içine atıyoruz.
    rv_sonuc = iv_sayi1 + iv_sayi2.
    
    " Sadece metodun çalıştığını kanıtlamak için ufak bir bilgi yazısı:
    WRITE: / '⚙️ LCL_MATEMATİK: Hesaplama arka planda başarıyla yapıldı.'.
  ENDMETHOD.

ENDCLASS.

* ======================================================================
* 3. ANA PROGRAM (NESNE YARATMA VE FONKSİYONEL METOT ÇAĞIRMA)
* ======================================================================
START-OF-SELECTION.
  DATA: lo_mat    TYPE REF TO lcl_matematik,
        lv_toplam TYPE i.

  WRITE: '🧮 ABAP OOP: PARAMETRELİ METOTLAR'.
  WRITE: / '--------------------------------------------------'.

  " 1. Sınıfı hafızada canlandırıyoruz (Nesne yaratımı)
  CREATE OBJECT lo_mat.

  " 2. MODERN ABAP İPUCU (Functional Method Call):
  " Eğer bir metodun RETURNING parametresi varsa, o metodu sanki
  " normal bir değişkenmiş veya matematiksel bir formülmüş gibi 
  " doğrudan eşittir (=) işaretinin sağına yazabiliriz!
  
  lv_toplam = lo_mat->topla( iv_sayi1 = 40 
                             iv_sayi2 = 60 ).

  WRITE: / '--------------------------------------------------'.
  WRITE: / |İşlem Sonucu (lv_toplam) : { lv_toplam }|.
  
  " Hatta sonucu bir değişkene atmadan doğrudan ekrana bile basabiliriz!
  " WRITE: / |Doğrudan Çağırım : { lo_mat->topla( iv_sayi1 = 10 iv_sayi2 = 15 ) }|.`,
  },
  {
    id: "u4-l4",
    tcode: "SE24",
    title: "4. Constructor (Kurucu Metot)",
    desc: "Bir nesne hafızada yaratıldığı anda (Doğum Anı) otomatik olarak çalışan ilk ve en özel metot.",
    code: `REPORT z_ders_u4_4_constructor.

* ======================================================================
* 1. CONSTRUCTOR (YAPICI / KURUCU METOT) NEDİR?
* C# veya Java gibi modern OOP dillerindeki yapıcı metotların aynısıdır.
* Bir nesne "CREATE OBJECT" komutuyla hafızada yaratıldığı an, bizim 
* çağırmamıza gerek kalmadan OTOMATİK olarak bir kez çalışır.
* Amacı: Nesne hayata gözlerini açarken ona ilk değerlerini (renk, isim, 
* ID vb.) vermektir.
* ======================================================================
CLASS lcl_kedi DEFINITION.
  PUBLIC SECTION.
    DATA: renk TYPE string.

    " Özel İsim: Metodun adı KESİNLİKLE "constructor" olmak zorundadır.
    METHODS: constructor IMPORTING iv_renk TYPE string,
             miyavla.
ENDCLASS.

* ======================================================================
* 2. IMPLEMENTATION (METOTLARIN İÇERİĞİ)
* ======================================================================
CLASS lcl_kedi IMPLEMENTATION.
  
  METHOD constructor.
    " Sınıfın kendi özelliği (renk) ile dışarıdan gelen (iv_renk) veriyi 
    " eşleştiriyoruz. Karmaşayı önlemek için "me->" (Diğer dillerdeki "this.") 
    " kelimesini kullanmak çok profesyonel bir yaklaşımdır. O anki nesneyi işaret eder.
    me->renk = iv_renk.
    
    WRITE: / '✨ Sistem: Yeni bir kedi nesnesi hafızada yaratıldı!'.
  ENDMETHOD.

  METHOD miyavla.
    WRITE: / |🐱 Miyav! Benim rengim: { me->renk }|.
  ENDMETHOD.

ENDCLASS.

* ======================================================================
* 3. ANA PROGRAM VE ÇAĞIRIM
* DİKKAT: constructor "IMPORTING" ile veri bekler, ancak biz CREATE OBJECT 
* yaparken veriyi "EXPORTING" (Dışarı gönderen) olarak veririz!
* Neden? Çünkü ana program veriyi nesneye "İhraç eder" (Export), 
* nesne ise bu veriyi kendi içine "İthal eder" (Import).
* ======================================================================

START-OF-SELECTION.
  DATA: lo_tekir TYPE REF TO lcl_kedi,
        lo_pamuk TYPE REF TO lcl_kedi.

  WRITE: '🐾 ABAP OOP: CONSTRUCTOR (KURUCU METOT)'.
  WRITE: / '--------------------------------------------------'.

  WRITE: / '--- 1. Kedi Yaratılıyor (Tekir) ---'.
  " Renk bilgisini nesneyi YARATIRKEN (Doğum anında) veriyoruz!
  CREATE OBJECT lo_tekir 
    EXPORTING 
      iv_renk = 'Gri'.
      
  lo_tekir->miyavla( ).

  WRITE: /.
  WRITE: / '--- 2. Kedi Yaratılıyor (Pamuk) ---'.
  CREATE OBJECT lo_pamuk 
    EXPORTING 
      iv_renk = 'Bembeyaz'.
      
  lo_pamuk->miyavla( ).

* ======================================================================
* 4. MODERN ABAP İPUCU (NEW OPERATÖRÜ)
* Yeni nesil SAP sistemlerinde CREATE OBJECT komutu yerine tıpkı diğer 
* modern dillerdeki gibi "NEW" anahtar kelimesi kullanılır:
*
* lo_tekir = NEW #( iv_renk = 'Gri' ).
* ======================================================================
`,
  },
  {
    id: "u4-l5",
    tcode: "SE24",
    title: "5. Kalıtım (Inheritance) - İleri Seviye",
    desc: "Bir sınıftan başka bir sınıf türetmek (Miras Alma) ve kod tekrarını (DRY) önlemek.",
    code: `REPORT z_ders_u4_5_inheritance.

* ======================================================================
* 1. SUPERCLASS (ATA / EBEVEYN SINIF)
* Kalıtım (Inheritance), yazılımda "Kod Tekrarını" önlemenin en iyi yoludur.
* Bütün hayvanların ortak özelliklerini (Nefes almak, yemek yemek, uyumak)
* tek tek her hayvana yazmak yerine, genel bir "Ata Sınıf" içine yazarız.
* ======================================================================
CLASS lcl_hayvan DEFINITION.
  PUBLIC SECTION.
    METHODS: nefes_al.
ENDCLASS.

CLASS lcl_hayvan IMPLEMENTATION.
  METHOD nefes_al.
    WRITE: / '🌬️ Hayvan (Ata Sınıf): Oksijen alıp veriyor...'.
  ENDMETHOD.
ENDCLASS.

* ======================================================================
* 2. SUBCLASS (ÇOCUK / MİRASÇI SINIF)
* Kuş da biyolojik olarak bir hayvandır. O yüzden lcl_hayvan sınıfından 
* türetilir (INHERITING FROM). Bu sayede "nefes_al" metodunu tekrar yazmamıza 
* gerek kalmaz, onu genetik olarak ata sınıfından miras alır!
* Bunun üzerine sadece kendine has özel yeteneklerini (Uçmak) ekler.
* ======================================================================
CLASS lcl_kus DEFINITION INHERITING FROM lcl_hayvan.
  PUBLIC SECTION.
    METHODS: uc.
    
    " Vizyon Notu: Eğer kuş nefes almayı farklı bir şekilde (Örn: Akciğer 
    " keseleriyle) yapsaydı, atadan gelen metodu ezip kendi tarzında yazmak 
    " için REDEFINITION komutunu kullanırdık. (METHODS: nefes_al REDEFINITION.)
ENDCLASS.

CLASS lcl_kus IMPLEMENTATION.
  METHOD uc.
    WRITE: / '🦅 Kuş (Çocuk Sınıf): Kanatlarını çırparak gökyüzünde uçuyor!'.
  ENDMETHOD.
ENDCLASS.

* ======================================================================
* 3. ANA PROGRAM (MİRASIN KANITI)
* ======================================================================
[Image of OOP Inheritance concept showing Parent and Child classes]
START-OF-SELECTION.
  DATA: lo_marti TYPE REF TO lcl_kus.

  WRITE: '🧬 ABAP OOP: KALITIM (INHERITANCE)'.
  WRITE: / '--------------------------------------------------'.

  CREATE OBJECT lo_marti.

  WRITE: / '--- 1. Miras Alınan Özellik (Genetik) ---'.
  " DİKKAT: lcl_kus sınıfının içine bakarsanız "nefes_al" diye bir kod 
  " yazmadığımızı görürsünüz. Ama o bir hayvan olduğu için atalarından 
  " bu yeteneği miras aldı ve özgürce kullanabiliyor!
  
  lo_marti->nefes_al( ).

  WRITE: /.
  WRITE: / '--- 2. Kendi Eklediği Özellik ---'.
  " Bu yetenek sadece kuşlara (lcl_kus) özeldir.
  " Normal bir lcl_hayvan nesnesi uçamaz!
  
  lo_marti->uc( ).`,
  },
];
