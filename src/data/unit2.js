export const unit2 = [
  {
    id: "u2-l1",
    tcode: "SE11",
    title: "1. Yapı (Structure) Tanımlama",
    desc: "Birden fazla veriyi (Ad, Soyad, Yaş) tek bir değişkende tutmak.",
    code: `REPORT z_ders_u2_1.

START-OF-SELECTION.
  " 1. TİP TANIMI (Şablon Oluşturma)
  TYPES: BEGIN OF ty_personel,
           id     TYPE i,
           ad     TYPE string,
           soyad  TYPE string,
           maas   TYPE i,
         END OF ty_personel.

  " 2. DEĞİŞKEN TANIMI (Structure / Work Area)
  DATA: ls_personel TYPE ty_personel.

  " 3. VERİ DOLDURMA
  ls_personel-id    = 1001.
  ls_personel-ad    = 'Mehmet'.
  ls_personel-soyad = 'Yilmaz'.
  ls_personel-maas  = 50000.

  " 4. EKRANA YAZDIRMA
  WRITE 'Personel Bilgisi:'.
  WRITE /.
  WRITE |ID: { ls_personel-id }|.
  WRITE / |Ad Soyad: { ls_personel-ad } { ls_personel-soyad }|.
  WRITE / |Maaş: { ls_personel-maas } TL|.`,
  },
  {
    id: "u2-l2",
    tcode: "SE38",
    title: "2. İç Tablo (Internal Table) ve APPEND",
    desc: "Birden fazla satırı hafızada tutmak için tablo oluşturmak.",
    code: `REPORT z_ders_u2_2.

START-OF-SELECTION.
  TYPES: BEGIN OF ty_malzeme,
           matnr TYPE string, " Malzeme No
           maktx TYPE string, " Malzeme Adı
           adet  TYPE i,
         END OF ty_malzeme.

  " Work Area (Tek satır)
  DATA: ls_malzeme TYPE ty_malzeme.
  
  " Internal Table (Tablo / Liste)
  DATA: lt_malzemeler TYPE TABLE OF ty_malzeme.

  " --- 1. Satır Ekleme ---
  ls_malzeme-matnr = 'M-01'.
  ls_malzeme-maktx = 'Laptop'.
  ls_malzeme-adet  = 10.
  APPEND ls_malzeme TO lt_malzemeler.

  " --- 2. Satır Ekleme ---
  ls_malzeme-matnr = 'M-02'.
  ls_malzeme-maktx = 'Mouse'.
  ls_malzeme-adet  = 50.
  APPEND ls_malzeme TO lt_malzemeler.
  
  " CLEAR komutu Work Area'nın içini temizler (Tabloyu silmez)
  CLEAR ls_malzeme.

  WRITE 'Tabloya 2 adet malzeme eklendi.'.
  WRITE / 'Sistem Değişkeni (SY-TABIX) son eklenen satırı gösterir:'.
  WRITE sy-tabix.`,
  },
  {
    id: "u2-l3",
    tcode: "SE38",
    title: "3. Tabloyu Ekrana Basmak (LOOP)",
    desc: "Tablodaki tüm satırları tek tek gezmek için LOOP kullanılır.",
    code: `REPORT z_ders_u2_3.

START-OF-SELECTION.
  TYPES: BEGIN OF ty_ogrenci,
           no  TYPE i,
           ad  TYPE string,
           not TYPE i,
         END OF ty_ogrenci.

  DATA: ls_ogr TYPE ty_ogrenci,
        lt_sinif TYPE TABLE OF ty_ogrenci.

  " Önce biraz veri ekleyelim (Manuel)
  ls_ogr-no = 10. ls_ogr-ad = 'Ali'.   ls_ogr-not = 45. APPEND ls_ogr TO lt_sinif.
  ls_ogr-no = 20. ls_ogr-ad = 'Ayşe'.  ls_ogr-not = 80. APPEND ls_ogr TO lt_sinif.
  ls_ogr-no = 30. ls_ogr-ad = 'Fatma'. ls_ogr-not = 90. APPEND ls_ogr TO lt_sinif.

  WRITE '--- Sınıf Listesi ---'.
  WRITE /.

  " LOOP: Tablo bitene kadar döner
  LOOP AT lt_sinif INTO ls_ogr.
    
    WRITE |No: { ls_ogr-no }, Ad: { ls_ogr-ad }, Not: { ls_ogr-not }|.
    
    " Not kontrolü yapalım
    IF ls_ogr-not >= 50.
       WRITE ' -> Durum: GECTI'.
    ELSE.
       WRITE ' -> Durum: KALDI'.
    ENDIF.
    
    WRITE /. " Alt satıra geç
  ENDLOOP.
    cl_demo_output=>display( lt_sinif ).`,
  },
  {
    id: "u2-l4",
    tcode: "SE38",
    title: "4. Tablodan Satır Okuma (READ TABLE)",
    desc: "Belirli bir satırı bulmak için READ TABLE kullanılır.",
    code: `REPORT z_ders_u2_4.

START-OF-SELECTION.
  TYPES: BEGIN OF ty_sehir,
           plaka TYPE i,
           ad    TYPE string,
         END OF ty_sehir.

  DATA: ls_sehir TYPE ty_sehir,
        lt_ulke  TYPE TABLE OF ty_sehir.

  " Veri Hazırlığı
  ls_sehir-plaka = 34. ls_sehir-ad = 'Istanbul'. APPEND ls_sehir TO lt_ulke.
  ls_sehir-plaka = 06. ls_sehir-ad = 'Ankara'.   APPEND ls_sehir TO lt_ulke.
  ls_sehir-plaka = 35. ls_sehir-ad = 'Izmir'.    APPEND ls_sehir TO lt_ulke.

  WRITE 'Arama Yapılıyor (Plaka 06)...'.
  WRITE /.

  " WITH KEY: Belirli bir alana göre arama
  READ TABLE lt_ulke INTO ls_sehir WITH KEY plaka = 06.

  " sy-subrc kontrolü (0 = Bulundu, 4 = Bulunamadı)
  IF sy-subrc = 0.
    WRITE 'BULUNDU!'.
    WRITE / |Şehir: { ls_sehir-ad }|.
  ELSE.
    WRITE 'Kayıt bulunamadı.'.
  ENDIF.

  WRITE /.
  WRITE 'Arama Yapılıyor (Plaka 99)...'.
  
  READ TABLE lt_ulke INTO ls_sehir WITH KEY plaka = 99.
  IF sy-subrc <> 0.
    WRITE / 'HATA: Plaka 99 listede yok.'.
  ENDIF.`,
  },
  {
    id: "u2-l5",
    tcode: "SE38",
    title: "5. Veri Değiştirme (MODIFY & DELETE)",
    desc: "Tablodaki veriyi güncellemek veya silmek.",
    code: `REPORT z_ders_u2_5.

START-OF-SELECTION.
  TYPES: BEGIN OF ty_urun,
           id    TYPE i,
           fiyat TYPE i,
         END OF ty_urun.

  DATA: ls_urun TYPE ty_urun,
        lt_stok TYPE TABLE OF ty_urun.

  " Veri Ekleme
  ls_urun-id = 1. ls_urun-fiyat = 100. APPEND ls_urun TO lt_stok.
  ls_urun-id = 2. ls_urun-fiyat = 200. APPEND ls_urun TO lt_stok.
  ls_urun-id = 3. ls_urun-fiyat = 300. APPEND ls_urun TO lt_stok.

  WRITE '--- Orijinal Liste ---'.
  LOOP AT lt_stok INTO ls_urun.
    WRITE / |ID: { ls_urun-id }, Fiyat: { ls_urun-fiyat }|.
  ENDLOOP.

  WRITE /.
  WRITE '--- Güncelleme (ID 2 nin fiyatı 250 olacak) ---'.

  " 1. Okuma
  READ TABLE lt_stok INTO ls_urun WITH KEY id = 2.
  IF sy-subrc = 0.
    " 2. Değişiklik
    ls_urun-fiyat = 250.
    " 3. Tabloyu Güncelleme (MODIFY)
    MODIFY lt_stok FROM ls_urun INDEX sy-tabix.
  ENDIF.

  " ID 1'i Silelim
  DELETE lt_stok WHERE id = 1.

  WRITE /.
  WRITE '--- Son Durum (ID 1 silindi, ID 2 güncellendi) ---'.
  LOOP AT lt_stok INTO ls_urun.
    WRITE / |ID: { ls_urun-id }, Fiyat: { ls_urun-fiyat }|.
  ENDLOOP.`,
  },
  ,
  {
    id: "u2-l6",
    tcode: "ZALV_TEST",
    title: "6. ALV Raporlama (cl_demo_output)",
    desc: "Verileri tablo formatında (Grid) göstermek.",
    code: `REPORT z_alv_demo.

START-OF-SELECTION.
  TYPES: BEGIN OF ty_personel,
           sicil  TYPE i,
           ad     TYPE string,
           soyad  TYPE string,
           departman TYPE string,
           maas   TYPE i,
         END OF ty_personel.

  DATA: lt_personel TYPE TABLE OF ty_personel,
        ls_personel TYPE ty_personel.

  " 1. Kayıt
  ls_personel-sicil = 101. ls_personel-ad = 'Can'. ls_personel-soyad = 'Yilmaz'. ls_personel-departman = 'IT'. ls_personel-maas = 25000.
  APPEND ls_personel TO lt_personel.

  " 2. Kayıt
  ls_personel-sicil = 102. ls_personel-ad = 'Elif'. ls_personel-soyad = 'Kaya'. ls_personel-departman = 'IK'. ls_personel-maas = 22000.
  APPEND ls_personel TO lt_personel.

  " 3. Kayıt
  ls_personel-sicil = 103. ls_personel-ad = 'Murat'. ls_personel-soyad = 'Demir'. ls_personel-departman = 'Satis'. ls_personel-maas = 30000.
  APPEND ls_personel TO lt_personel.

  WRITE 'Veriler hazırlandı, tablo basılıyor...'.

  " --- SİHİRLİ KOMUT ---
  " Bu komut veriyi alır ve Frontend'deki Tablo sekmesine gönderir.
  cl_demo_output=>display( lt_personel ).`,
  },
];
