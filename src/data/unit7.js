export const unit7 = [
  {
    id: "u7-l1",
    tcode: "SE38",
    title: "1. İç İçe Yapılar (Nested Structures)",
    desc: "Bir yapının içine başka bir yapı koymak (Deep Structure).",
    code: `REPORT z_unit7_deep.

* 1. Alt Yapı (Adres)
TYPES: BEGIN OF ty_adres,
         sokak TYPE string,
         sehir TYPE string,
         pk    TYPE i,
       END OF ty_adres.

* 2. Ana Yapı (Kişi)
* Dikkat: 'adres' alanı, yukarıdaki 'ty_adres' tipindedir.
TYPES: BEGIN OF ty_kisi,
         ad    TYPE string,
         soyad TYPE string,
         adres TYPE ty_adres, " Yapı içinde yapı!
       END OF ty_kisi.

DATA: ls_kisi TYPE ty_kisi.

START-OF-SELECTION.
  ls_kisi-ad    = 'Mehmet'.
  ls_kisi-soyad = 'Yilmaz'.

  " İçteki yapıya erişim (-) ile devam eder
  ls_kisi-adres-sokak = 'Atatürk Cad.'.
  ls_kisi-adres-sehir = 'Ankara'.
  ls_kisi-adres-pk    = 06000.

  WRITE: '--- Kişi Bilgisi ---'.
  WRITE: / ls_kisi-ad, ls_kisi-soyad.
  
  WRITE: /.
  WRITE: '--- Adres Detayı ---'.
  WRITE: / ls_kisi-adres-sokak.
  WRITE: / ls_kisi-adres-sehir, ls_kisi-adres-pk.

  " Bu yapı tek bir kayıt olduğu için Write ile gösterdik.
  " Gridler genelde liste göstermek içindir.`,
  },
  {
    id: "u7-l2",
    tcode: "SE38",
    title: "2. Başlık ve Kalem Birleştirme (JOIN Mantığı)",
    desc: "İki ayrı tabloyu birleştirip tek bir ALV Raporu hazırlamak.",
    code: `REPORT z_unit7_header_item.

* --- TİP TANIMLARI ---
TYPES: BEGIN OF ty_baslik,
         siparis_no TYPE string,
         musteri    TYPE string,
       END OF ty_baslik.

TYPES: BEGIN OF ty_kalem,
         siparis_no TYPE string,
         urun       TYPE string,
         adet       TYPE i,
       END OF ty_kalem.

* Rapor için birleşik yapı (Flattening)
TYPES: BEGIN OF ty_rapor,
         siparis_no TYPE string,
         musteri    TYPE string,
         urun       TYPE string,
         adet       TYPE i,
       END OF ty_rapor.

DATA: lt_baslik TYPE TABLE OF ty_baslik,
      lt_kalem  TYPE TABLE OF ty_kalem,
      lt_rapor  TYPE TABLE OF ty_rapor, " Sonuç Tablosu
      ls_baslik TYPE ty_baslik,
      ls_kalem  TYPE ty_kalem,
      ls_rapor  TYPE ty_rapor.

START-OF-SELECTION.
  " 1. Veri Hazırlığı
  ls_baslik-siparis_no = '1001'. ls_baslik-musteri = 'ABC Ltd'. APPEND ls_baslik TO lt_baslik.
  ls_baslik-siparis_no = '1002'. ls_baslik-musteri = 'XYZ A.Ş.'. APPEND ls_baslik TO lt_baslik.

  ls_kalem-siparis_no = '1001'. ls_kalem-urun = 'Laptop'. ls_kalem-adet = 5. APPEND ls_kalem TO lt_kalem.
  ls_kalem-siparis_no = '1001'. ls_kalem-urun = 'Mouse'.  ls_kalem-adet = 10. APPEND ls_kalem TO lt_kalem.
  ls_kalem-siparis_no = '1002'. ls_kalem-urun = 'Klavye'. ls_kalem-adet = 2. APPEND ls_kalem TO lt_kalem.

  " --- 2. VERİ BİRLEŞTİRME (NESTED LOOP) ---
  LOOP AT lt_baslik INTO ls_baslik.
    
    " Bu siparişe ait kalemleri bul
    LOOP AT lt_kalem INTO ls_kalem WHERE siparis_no = ls_baslik-siparis_no.
       
       " Rapor satırını doldur
       CLEAR ls_rapor.
       ls_rapor-siparis_no = ls_baslik-siparis_no. " Başlıktan al
       ls_rapor-musteri    = ls_baslik-musteri.    " Başlıktan al
       ls_rapor-urun       = ls_kalem-urun.        " Kalemden al
       ls_rapor-adet       = ls_kalem-adet.        " Kalemden al
       
       " Rapor tablosuna ekle
       APPEND ls_rapor TO lt_rapor.
       
    ENDLOOP.
  ENDLOOP.

  WRITE: 'Rapor hazırlandı. ALV Sekmesine geçiniz...'.

  " --- 3. ALV ÇIKTISI ---
  cl_demo_output=>display( lt_rapor ).`,
  },
  {
    id: "u7-l3",
    tcode: "SE38",
    title: "3. Modern String Template (|...|)",
    desc: "Metinleri birleştirmek için en yeni ve en kolay yöntem.",
    code: `REPORT z_unit7_template.

DATA: lv_ad     TYPE string,
      lv_soyad  TYPE string,
      lv_yas    TYPE i,
      lv_mesaj  TYPE string,
      lv_tarih  TYPE d.

START-OF-SELECTION.
  lv_ad    = 'Can'.
  lv_soyad = 'Yücel'.
  lv_yas   = 30.
  lv_tarih = sy-datum.

  " ESKİ YÖNTEM: CONCATENATE
  " Çok uzundur ve boşlukları yönetmek zordur.

  " YENİ YÖNTEM: String Template (| |)
  " Süslü parantez { } içine değişken yazabilirsin.
  
  lv_mesaj = |Sayın { lv_ad } { lv_soyad }, yaşınız: { lv_yas }.|.
  WRITE: / lv_mesaj.

  " FORMATLAMA ÖZELLİKLERİ
  " Tarihi formatlayarak yazma
  WRITE: /.
  WRITE: |Bugünün Tarihi (ISO): { lv_tarih DATE = ISO }|.
  WRITE: / |Bugünün Tarihi (USER): { lv_tarih DATE = USER }|.

  " Hizalama (Align)
  WRITE: /.
  WRITE: |{ 'SOL' WIDTH = 10 ALIGN = LEFT }|.
  WRITE: |{ 'SAĞ' WIDTH = 10 ALIGN = RIGHT }|.`,
  },
  {
    id: "u7-l4",
    tcode: "ZINVOICE",
    title: "4. Proje: Fatura Detay Raporu",
    desc: "Başlık ve Kalemleri birleştirip Fatura Dökümü almak.",
    code: `REPORT z_unit7_project.

* --- YAPILAR ---
TYPES: BEGIN OF ty_baslik,
         fatura_no TYPE string,
         tarih     TYPE d,
         musteri   TYPE string,
       END OF ty_baslik.

TYPES: BEGIN OF ty_kalem,
         fatura_no TYPE string,
         malzeme   TYPE string,
         fiyat     TYPE i,
         adet      TYPE i,
       END OF ty_kalem.

* --- RAPOR YAPISI (Grid İçin) ---
TYPES: BEGIN OF ty_rapor,
         fatura_no TYPE string,
         tarih     TYPE d,
         musteri   TYPE string,
         malzeme   TYPE string,
         fiyat     TYPE i,
         adet      TYPE i,
         tutar     TYPE i, " Hesaplanan: Fiyat * Adet
       END OF ty_rapor.

DATA: lt_baslik TYPE TABLE OF ty_baslik,
      lt_kalem  TYPE TABLE OF ty_kalem,
      lt_rapor  TYPE TABLE OF ty_rapor,
      ls_baslik TYPE ty_baslik,
      ls_kalem  TYPE ty_kalem,
      ls_rapor  TYPE ty_rapor.

FIELD-SYMBOLS: <ls_baslik> TYPE ty_baslik,
               <ls_kalem>  TYPE ty_kalem.

START-OF-SELECTION.
  " --- 1. MOCK DATA ---
  " Fatura 1
  ls_baslik-fatura_no = 'FAT-001'. ls_baslik-tarih = '20240110'. ls_baslik-musteri = 'Ahmet A.'. APPEND ls_baslik TO lt_baslik.
  ls_kalem-fatura_no = 'FAT-001'. ls_kalem-malzeme = 'Kalem'.  ls_kalem-fiyat = 10. ls_kalem-adet = 5. APPEND ls_kalem TO lt_kalem.
  ls_kalem-fatura_no = 'FAT-001'. ls_kalem-malzeme = 'Defter'. ls_kalem-fiyat = 50. ls_kalem-adet = 2. APPEND ls_kalem TO lt_kalem.

  " Fatura 2
  ls_baslik-fatura_no = 'FAT-002'. ls_baslik-tarih = '20240215'. ls_baslik-musteri = 'Selin B.'. APPEND ls_baslik TO lt_baslik.
  ls_kalem-fatura_no = 'FAT-002'. ls_kalem-malzeme = 'Silgi'.  ls_kalem-fiyat = 5.  ls_kalem-adet = 20. APPEND ls_kalem TO lt_kalem.


  " --- 2. HESAPLAMA ve BİRLEŞTİRME ---
  LOOP AT lt_baslik ASSIGNING <ls_baslik>.
    
    " Alt kalemleri dön
    LOOP AT lt_kalem ASSIGNING <ls_kalem> WHERE fatura_no = <ls_baslik>-fatura_no.
       
       CLEAR ls_rapor.
       " Başlık Bilgileri
       ls_rapor-fatura_no = <ls_baslik>-fatura_no.
       ls_rapor-tarih     = <ls_baslik>-tarih.
       ls_rapor-musteri   = <ls_baslik>-musteri.
       
       " Kalem Bilgileri
       ls_rapor-malzeme   = <ls_kalem>-malzeme.
       ls_rapor-fiyat     = <ls_kalem>-fiyat.
       ls_rapor-adet      = <ls_kalem>-adet.
       
       " Hesaplama
       ls_rapor-tutar     = <ls_kalem>-fiyat * <ls_kalem>-adet.

       APPEND ls_rapor TO lt_rapor.
    ENDLOOP.
  ENDLOOP.

  WRITE: 'Rapor hesaplandı. Sonuçları görmek için ALV sekmesine geçin.'.

  " --- 3. ALV GRID GÖSTERİMİ ---
  cl_demo_output=>display( lt_rapor ).`,
  },
];
