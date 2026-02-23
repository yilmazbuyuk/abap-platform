export const unit2 = [
  {
    id: "u2-l1",
    tcode: "SE11",
    title: "1. Yapı (Structure) Tanımlama",
    desc: "Birden fazla farklı veriyi (Ad, Soyad, Maaş) tek bir paket (Work Area) içinde tutmak.",
    code: `REPORT z_ders_u2_1_structure.

START-OF-SELECTION.
* ======================================================================
* 1. TYPES: ŞABLON (KALIP) OLUŞTURMA
* TYPES komutu hafızada veri tutmaz, sadece bir "taslak" veya "kalıp" yaratır.
* Tıpkı bir kurabiye kalıbı gibi düşünün, henüz ortada yenecek bir şey yoktur.
* İsimlendirme Standardı: Tipler genellikle "ty_" (Type) ile başlar.
* ======================================================================
  TYPES: BEGIN OF ty_personel,
           id     TYPE i,         " Çalışan Numarası
           ad     TYPE string,    " Adı
           soyad  TYPE string,    " Soyadı
           maas   TYPE i,         " Maaşı
         END OF ty_personel.

* ======================================================================
* 2. DATA: DEĞİŞKEN (STRUCTURE / WORK AREA) OLUŞTURMA
* Şimdi yukarıdaki kalıbı kullanarak hafızada gerçek bir alan ayırıyoruz.
* Artık elimizde içine veri koyabileceğimiz bir paket var.
* İsimlendirme Standardı: Local Structure'lar genellikle "ls_" ile başlar.
* ======================================================================
  DATA: ls_personel TYPE ty_personel.

* ======================================================================
* 3. VERİ DOLDURMA (Tire '-' Operatörü)
* Bir Structure'ın içindeki alt alanlara ulaşmak için tire (-) işareti kullanılır.
* Okunuşu: "ls_personel nesnesinin 'ad' alanına git ve değer ata."
* ======================================================================
  ls_personel-id    = 1001.
  ls_personel-ad    = 'Mehmet'.
  ls_personel-soyad = 'Yılmaz'.
  ls_personel-maas  = 50000.

* ======================================================================
* 4. EKRANA YAZDIRMA
* Structure içindeki verileri okurken de yine tire (-) kullanırız.
* ======================================================================
  WRITE: '👤 PERSONEL BİLGİ KARTI'.
  WRITE: / '------------------------------'.
  
  " Pipe (|) işareti ile değişkenleri metinlerin içine direkt gömebiliriz
  WRITE: / |Sicil Numarası : { ls_personel-id }|.
  WRITE: / |Adı ve Soyadı  : { ls_personel-ad } { ls_personel-soyad }|.
  WRITE: / |Aylık Maaşı    : { ls_personel-maas } TL|.
  
  WRITE: / '------------------------------'.`,
  },
  {
    id: "u2-l2",
    tcode: "SE38",
    title: "2. İç Tablo (Internal Table) ve APPEND",
    desc: "Birden fazla veriyi bir liste (tablo) halinde hafızada tutmak ve APPEND ile satır eklemek.",
    code: `REPORT z_ders_u2_2_internal_table.

START-OF-SELECTION.
* ======================================================================
* 1. TYPES: KALIP OLUŞTURMA (Structure Type)
* Tıpkı bir önceki dersteki gibi, tablomuzun kolonlarını tanımlıyoruz.
* ======================================================================
  TYPES: BEGIN OF ty_malzeme,
           matnr TYPE string, " Malzeme Numarası (Material Number)
           maktx TYPE string, " Malzeme Adı (Material Text)
           adet  TYPE i,      " Stok Adedi
         END OF ty_malzeme.

* ======================================================================
* 2. WORK AREA (ls_) VE INTERNAL TABLE (lt_) TANIMLAMA
* Work Area (ls_): Tek bir satırı tutan yapıdır. (Doldurulan form kağıdı)
* Internal Table (lt_): Birden fazla satırı tutan listedir. (Dosya dolabı)
*
* Kural: Dosya dolabına (Table) doğrudan yazı yazılamaz! Önce form 
* kağıdını (Work Area) doldurup, sonra onu dolaba kaldırmalıyız.
* ======================================================================
  DATA: ls_malzeme    TYPE ty_malzeme,              " Work Area (Tekil Satır)
        lt_malzemeler TYPE TABLE OF ty_malzeme.     " Internal Table (Tablo/Liste)

  WRITE: '📦 ABAP İÇ TABLO (INTERNAL TABLE) YÖNETİMİ'.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* 3. TABLOYA VERİ EKLEME (APPEND KOMUTU)
* ======================================================================
  
  " --- 1. Kaydı Hazırlayıp Tabloya Ekleyelim ---
  ls_malzeme-matnr = 'M-001'.
  ls_malzeme-maktx = 'Dizüstü Bilgisayar'.
  ls_malzeme-adet  = 10.
  
  APPEND ls_malzeme TO lt_malzemeler. " Formu dolaba kaldır!
  
  WRITE: / '✅ 1. Malzeme tabloya eklendi. (Satır Numarası:', sy-tabix, ')'.
  " Not: "sy-tabix" sistem değişkeni, tabloya yapılan son işlemin satır sırasını tutar.

  " --- CLEAR KOMUTUNUN ÖNEMİ ---
  " Yeni bir kayıt girmeden önce Work Area'nın (form kağıdının) içini silmek (CLEAR)
  " altın bir kuraldır! Aksi takdirde eski veriler yeni kayda yanlışlıkla sızabilir.
  CLEAR ls_malzeme.

  " --- 2. Kaydı Hazırlayıp Tabloya Ekleyelim ---
  ls_malzeme-matnr = 'M-002'.
  ls_malzeme-maktx = 'Kablosuz Mouse'.
  ls_malzeme-adet  = 50.
  
  APPEND ls_malzeme TO lt_malzemeler. " İkinci formu da dolaba kaldır!
  
  WRITE: / '✅ 2. Malzeme tabloya eklendi. (Satır Numarası:', sy-tabix, ')'.

  " İşimiz bitince temiz tezgah bırakmak için son bir kez temizliyoruz.
  CLEAR ls_malzeme.

* ======================================================================
* 4. TABLO BİLGİLERİNİ KONTROL ETME (lines fonksiyonu)
* lines() fonksiyonu, bir tablonun içinde anlık olarak kaç satır olduğunu sayar.
* ======================================================================
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Toplam Kayıt Sayısı: { lines( lt_malzemeler ) } adet malzeme var.|.`,
  },
  {
    id: "u2-l3",
    tcode: "SE38",
    title: "3. Tabloyu Ekrana Basmak (LOOP)",
    desc: "Internal Table içindeki verileri satır satır okumak için LOOP döngüsünü kullanmak.",
    code: `REPORT z_ders_u2_3_loop.

START-OF-SELECTION.
* ======================================================================
* 1. TYPES VE DATA TANIMLAMALARI
* ======================================================================
  TYPES: BEGIN OF ty_ogrenci,
           no    TYPE i,          " Öğrenci Numarası
           ad    TYPE string,     " Öğrenci Adı
           notu  TYPE i,          " Sınav Notu
         END OF ty_ogrenci.

  DATA: ls_ogr   TYPE ty_ogrenci,              " Work Area (Masa)
        lt_sinif TYPE TABLE OF ty_ogrenci.     " Internal Table (Dolap)

* ======================================================================
* 2. TABLOYU (DOLABI) DOLDURMA
* Kural: Her yeni kayıttan önce Work Area'yı (ls_) temizle!
* ======================================================================
  
  CLEAR ls_ogr.
  ls_ogr-no = 101. ls_ogr-ad = 'Ali'.   ls_ogr-notu = 45. 
  APPEND ls_ogr TO lt_sinif.

  CLEAR ls_ogr.
  ls_ogr-no = 102. ls_ogr-ad = 'Ayşe'.  ls_ogr-notu = 80. 
  APPEND ls_ogr TO lt_sinif.

  CLEAR ls_ogr.
  ls_ogr-no = 103. ls_ogr-ad = 'Fatma'. ls_ogr-notu = 90. 
  APPEND ls_ogr TO lt_sinif.

* ======================================================================
* 3. TABLOYU OKUMAK (LOOP AT ... INTO ...)
* LOOP döngüsü, tablonun içindeki satır sayısı kadar otomatik döner.
* "INTO ls_ogr" mantığı şudur: Dolaptaki (lt_) dosyayı al, işlem 
* yapabilmem için geçici olarak masama (ls_) koy.
* ======================================================================
  WRITE: '🎓 SINIF LİSTESİ VE BAŞARI DURUMU'.
  WRITE: / '--------------------------------------------------'.

  LOOP AT lt_sinif INTO ls_ogr.
    
    " sy-tabix: Döngünün o an kaçıncı satırı okuduğunu verir.
    WRITE: / |{ sy-tabix }. Öğrenci: { ls_ogr-no } - { ls_ogr-ad } (Not: { ls_ogr-notu })|.
    
    " O an masada (ls_ogr) hangi öğrenci varsa onun notunu kontrol ediyoruz.
    IF ls_ogr-notu >= 50.
       WRITE: ' => Sonuç: GEÇTİ ✅'.
    ELSE.
       WRITE: ' => Sonuç: KALDI ❌'.
    ENDIF.

  ENDLOOP.

* ======================================================================
* 4. MODERN ÇIKTI: CL_DEMO_OUTPUT
* Gerçek projelerde karmaşık ALV raporları (kullanıcıların gördüğü 
* ızgara şeklindeki tablolar) yazılır. Ancak arka planda kod geliştirirken 
* tablomuzun içinin doğru dolup dolmadığını test etmek için 
* cl_demo_output=>display( ) sınıfı tek satırda mükemmel bir tablo çizer!
* ======================================================================
  cl_demo_output=>display( lt_sinif ).`,
  },
  {
    id: "u2-l4",
    tcode: "SE38",
    title: "4. Tablodan Satır Okuma (READ TABLE)",
    desc: "Milyonlarca satırlık bir tablodan belirli bir kaydı (Nokta Atışı) bulup Work Area'ya almak.",
    code: `REPORT z_ders_u2_4_read_table.

START-OF-SELECTION.
* ======================================================================
* 1. TYPES VE DATA TANIMLAMALARI
* ======================================================================
  TYPES: BEGIN OF ty_sehir,
           plaka TYPE i,
           ad    TYPE string,
         END OF ty_sehir.

  DATA: ls_sehir TYPE ty_sehir,              " Work Area (Masa)
        lt_ulke  TYPE TABLE OF ty_sehir.     " Internal Table (Dolap)

* ======================================================================
* 2. TABLOYU DOLDURMA
* ======================================================================
  ls_sehir-plaka = 34. ls_sehir-ad = 'İstanbul'. APPEND ls_sehir TO lt_ulke. CLEAR ls_sehir.
  ls_sehir-plaka = 06. ls_sehir-ad = 'Ankara'.   APPEND ls_sehir TO lt_ulke. CLEAR ls_sehir.
  ls_sehir-plaka = 35. ls_sehir-ad = 'İzmir'.    APPEND ls_sehir TO lt_ulke. CLEAR ls_sehir.
  ls_sehir-plaka = 42. ls_sehir-ad = 'Konya'.    APPEND ls_sehir TO lt_ulke. CLEAR ls_sehir. 

* ======================================================================
* 3. READ TABLE (NOKTA ATIŞI ARAMA)
* LOOP döngüsü bir kitabı sayfa sayfa okumak gibidir. READ TABLE ise 
* kitabın arkasındaki indekse bakıp direkt aradığınız sayfayı açmaktır.
* Bizim sadece tek bir kayda ihtiyacımız varsa READ TABLE kullanırız.
* ======================================================================
  WRITE: '🔍 ABAP READ TABLE (VERİ ARAMA) REHBERİ'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / 'Arama Yapılıyor: Plaka = 42 ...'.

  " WITH KEY: Hangi kolonda, hangi veriyi aradığımızı belirtiriz.
  READ TABLE lt_ulke INTO ls_sehir WITH KEY plaka = 42.

* ======================================================================
* 4. SY-SUBRC KONTROLÜ (HAYATİ ÖNEM TAŞIR!)
* sy-subrc: ABAP'ta bir işlemin başarılı olup olmadığını söyleyen değişkendir.
* 0 = İşlem BAŞARILI (Kayıt bulundu ve ls_sehir içine konuldu)
* 4 = İşlem BAŞARISIZ (Kayıt tabloda yok, ls_sehir boş kaldı)
* READ TABLE yaptıktan HEMEN SONRA mutlaka sy-subrc kontrolü yapılmalıdır!
* ======================================================================
  
  IF sy-subrc = 0.
    WRITE: / '✅ BULUNDU!'.
    WRITE: / |Şehir Bilgisi: { ls_sehir-plaka } - { ls_sehir-ad }|.
  ELSE.
    WRITE: / '❌ Kayıt bulunamadı.'.
  ENDIF.

  WRITE: / '--------------------------------------------------'.
  WRITE: / 'Arama Yapılıyor: Plaka = 99 ...'.
  
  " Olmayan bir plakayı arayalım
  READ TABLE lt_ulke INTO ls_sehir WITH KEY plaka = 99.
  
  IF sy-subrc <> 0. " Sıfıra eşit değilse (Yani başarısızsa)
    WRITE: / '❌ HATA: Plaka 99 sistemde (tabloda) kayıtlı değil.'.
  ENDIF.

* ======================================================================
* 5. MODERN ABAP İPUCU (BONUS)
* Yeni nesil SAP sistemlerinde (S/4HANA vb.) READ TABLE yerine 
* köşeli parantezler (Table Expressions) kullanılır:
* ls_sehir = lt_ulke[ plaka = 06 ]. 
* ======================================================================
`,
  },
  {
    id: "u2-l5",
    tcode: "SE38",
    title: "5. Veri Değiştirme (MODIFY & DELETE)",
    desc: "Tablodaki veriyi güncellemek (MODIFY) veya şarta bağlı olarak silmek (DELETE).",
    code: `REPORT z_ders_u2_5_modify_delete.

START-OF-SELECTION.
* ======================================================================
* 1. TYPES VE DATA TANIMLAMALARI
* ======================================================================
  TYPES: BEGIN OF ty_urun,
           id    TYPE i,          " Ürün ID
           ad    TYPE string,     " Ürün Adı
           fiyat TYPE p DECIMALS 2, " Fiyat (Ondalıklı tip)
         END OF ty_urun.

  DATA: ls_urun TYPE ty_urun,
        lt_stok TYPE TABLE OF ty_urun.

* ======================================================================
* 2. TABLOYU DOLDURMA (STOK GİRİŞİ)
* ======================================================================
  CLEAR ls_urun. ls_urun-id = 1. ls_urun-ad = 'Klavye'. ls_urun-fiyat = 100. APPEND ls_urun TO lt_stok.
  CLEAR ls_urun. ls_urun-id = 2. ls_urun-ad = 'Mouse'.  ls_urun-fiyat = 200. APPEND ls_urun TO lt_stok.
  CLEAR ls_urun. ls_urun-id = 3. ls_urun-ad = 'Ekran'.  ls_urun-fiyat = 300. APPEND ls_urun TO lt_stok.

  WRITE: '📦 ORİJİNAL STOK LİSTESİ'.
  WRITE: / '--------------------------------------------------'.
  LOOP AT lt_stok INTO ls_urun.
    WRITE: / |ID: { ls_urun-id } | Ürün: { ls_urun-ad } | Fiyat: { ls_urun-fiyat } TL|.
  ENDLOOP.

* ======================================================================
* 3. VERİ GÜNCELLEME (MODIFY KOMUTU)
* Tablodaki bir satırı güncellemek 3 aşamalı bir işlemdir:
* 1. Dosyayı dolaptan masaya al (READ TABLE)
* 2. Masadaki kağıdın üzerinde değişikliği yap (ls_urun-...)
* 3. Değiştirilmiş kağıdı dolaptaki AYNI SIRAYA geri koy (MODIFY ... INDEX)
* ======================================================================
  WRITE: /.
  WRITE: / '🔄 GÜNCELLEME: Mouse fiyatı 250 TL yapılıyor...'.

  " Adım 1: Masaya al
  READ TABLE lt_stok INTO ls_urun WITH KEY id = 2.
  
  IF sy-subrc = 0. " Kayıt bulunduysa
    
    " Adım 2: Masada düzenle
    ls_urun-fiyat = 250.
    
    " Adım 3: Tabloyu Güncelle (sy-tabix okunan satırın sırasını tutar, aynı yere koyarız)
    MODIFY lt_stok FROM ls_urun INDEX sy-tabix.
    WRITE: / '✅ Güncelleme Başarılı!'.
    
  ENDIF.

* ======================================================================
* 4. VERİ SİLME (DELETE KOMUTU)
* DELETE ... WHERE komutu, şarta uyan satırı/satırları tablodan siler.
* ======================================================================
  WRITE: /.
  WRITE: / '🗑️ SİLME: ID 1 (Klavye) stoktan çıkarılıyor...'.

  DELETE lt_stok WHERE id = 1.
  WRITE: / '✅ Silme Başarılı!'.

* ======================================================================
* 5. SON DURUMU LİSTELEME
* ======================================================================
  WRITE: /.
  WRITE: / '📦 GÜNCEL STOK LİSTESİ (Son Durum)'.
  WRITE: / '--------------------------------------------------'.
  LOOP AT lt_stok INTO ls_urun.
    WRITE: / |ID: { ls_urun-id } | Ürün: { ls_urun-ad } | Fiyat: { ls_urun-fiyat } TL|.
  ENDLOOP.`,
  },

  {
    id: "u2-l6",
    tcode: "ZALV_TEST",
    title: "6. ALV Raporlama (cl_demo_output)",
    desc: "Internal Table içindeki verileri Excel benzeri bir ızgara (Grid) formatında ekrana basmak.",
    code: `REPORT z_alv_demo_rapor.

START-OF-SELECTION.
* ======================================================================
* 1. ALV NEDİR? (ABAP List Viewer)
* SAP'de verileri Excel benzeri, filtrelenebilir, sıralanabilir ızgara 
* (Grid) formatında göstermeye ALV denir. Gerçek projelerde CL_SALV_TABLE
* veya REUSE_ALV_GRID_DISPLAY kullanılır. Ancak geliştirme yaparken kodları 
* test edip hızlıca tablo yazdırmak için en modern yöntem cl_demo_output sınıfıdır.
* ======================================================================

  TYPES: BEGIN OF ty_personel,
           sicil     TYPE i,            " Sicil Numarası
           ad        TYPE string,       " Personel Adı
           soyad     TYPE string,       " Personel Soyadı
           departman TYPE string,       " Çalıştığı Departman
           maas      TYPE p DECIMALS 2, " Maaş Bilgisi
         END OF ty_personel.

  DATA: lt_personel TYPE TABLE OF ty_personel,  " Internal Table (Liste)
        ls_personel TYPE ty_personel.           " Work Area (Tekil Kayıt)

* ======================================================================
* 2. VERİ HAZIRLIĞI (TABLOYU DOLDURMA)
* Altın kuralı unutmuyoruz: Her yeni kayıttan önce CLEAR ls_personel!
* ======================================================================
  
  " 1. Kayıt
  CLEAR ls_personel. 
  ls_personel-sicil = 101. ls_personel-ad = 'Can'.   ls_personel-soyad = 'Yılmaz'. ls_personel-departman = 'IT'.    ls_personel-maas = 45000.
  APPEND ls_personel TO lt_personel.

  " 2. Kayıt
  CLEAR ls_personel. 
  ls_personel-sicil = 102. ls_personel-ad = 'Elif'.  ls_personel-soyad = 'Kaya'.   ls_personel-departman = 'IK'.    ls_personel-maas = 42000.
  APPEND ls_personel TO lt_personel.

  " 3. Kayıt
  CLEAR ls_personel. 
  ls_personel-sicil = 103. ls_personel-ad = 'Murat'. ls_personel-soyad = 'Demir'.  ls_personel-departman = 'Satış'. ls_personel-maas = 50000.
  APPEND ls_personel TO lt_personel.

  WRITE: '🚀 Veriler başarıyla hafızaya alındı.'.
  WRITE: / 'Sihirli komut çalıştırılıyor ve tablo ekrana basılıyor...'.

* ======================================================================
* 3. SİHİRLİ KOMUT: cl_demo_output=>display( )
* Bu komut parametre olarak aldığı her türlü değişkeni, Work Area'yı
* veya Internal Table'ı alır ve ekrana muazzam bir tablo olarak çizer.
* ABAP geliştiricilerinin hayat kurtarıcısıdır!
* ======================================================================
  
  cl_demo_output=>display( lt_personel ).`,
  },
];
