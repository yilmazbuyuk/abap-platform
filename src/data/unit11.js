export const unit11 = [
  {
    id: "u11-final",
    tcode: "Z_MINI_ERP",
    title: "🎓 MEZUNİYET PROJESİ: Mini ERP Sistemi",
    desc: "Müşteri, Stok ve Satış verilerini yöneten, analiz eden ve raporlayan devasa bir sistem.",
    code: `REPORT z_unit11_minierp.

* ======================================================================
* 🎓 BÜYÜK FİNAL: MINI ERP SİSTEMİ
* Amaç: Öğrenilen tüm teknikleri (Tables, OOP, ALV, Input, Logic) birleştirmek.
* ======================================================================

* --- 1. VERİ TİPLERİ (DATABASE YAPILARI) ---
TYPES: BEGIN OF ty_musteri,
         id     TYPE i,
         ad     TYPE string,
         sehir  TYPE string,
         bakiye TYPE i,
       END OF ty_musteri.

TYPES: BEGIN OF ty_urun,
         kod   TYPE string,
         ad    TYPE string,
         fiyat TYPE i,
         stok  TYPE i,
       END OF ty_urun.

TYPES: BEGIN OF ty_satis,
         belge_no   TYPE string,
         musteri_id TYPE i,
         urun_kod   TYPE string,
         adet       TYPE i,
         tutar      TYPE i,
         tarih      TYPE d,
       END OF ty_satis.

* --- 2. GLOBAL TABLOLAR (VERİTABANI SİMÜLASYONU) ---
DATA: lt_musteriler TYPE TABLE OF ty_musteri,
      lt_urunler    TYPE TABLE OF ty_urun,
      lt_satislar   TYPE TABLE OF ty_satis.

DATA: ls_musteri TYPE ty_musteri,
      ls_urun    TYPE ty_urun,
      ls_satis   TYPE ty_satis.

* Raporlama için birleşik yapı
TYPES: BEGIN OF ty_rapor,
         durum      TYPE string, " 🟢/🔴
         belge_no   TYPE string,
         musteri_ad TYPE string,
         sehir      TYPE string,
         urun_ad    TYPE string,
         adet       TYPE i,
         toplam     TYPE i,
         tarih      TYPE d,
       END OF ty_rapor.

DATA: lt_rapor TYPE TABLE OF ty_rapor,
      ls_rapor TYPE ty_rapor.

FIELD-SYMBOLS: <fs_mus>  TYPE ty_musteri,
               <fs_urun> TYPE ty_urun.

* --- 3. GİRİŞ EKRANI (DASHBOARD) ---
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE text-001.
  PARAMETERS: p_belge TYPE string.             " Belge No Ara
  PARAMETERS: p_sehir TYPE string.             " Şehre Göre Filtrele
  PARAMETERS: p_limit TYPE i DEFAULT 1000.     " Min Sipariş Tutarı
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE text-002.
  PARAMETERS: p_analiz AS CHECKBOX.            " Detaylı Analiz Modu?
  PARAMETERS: p_stok   AS CHECKBOX.            " Stok Uyarısı Göster?
SELECTION-SCREEN END OF BLOCK b2.

START-OF-SELECTION.

  " --- 4. VERİ YÜKLEME (INIT) ---
  " Müşteriler
  ls_musteri-id = 101. ls_musteri-ad = 'Tech A.Ş.'.    ls_musteri-sehir = 'Istanbul'. ls_musteri-bakiye = 50000. APPEND ls_musteri TO lt_musteriler.
  ls_musteri-id = 102. ls_musteri-ad = 'Anadolu Ltd'.  ls_musteri-sehir = 'Ankara'.   ls_musteri-bakiye = 20000. APPEND ls_musteri TO lt_musteriler.
  ls_musteri-id = 103. ls_musteri-ad = 'Ege Gıda'.     ls_musteri-sehir = 'Izmir'.    ls_musteri-bakiye = 5000.  APPEND ls_musteri TO lt_musteriler.

  " Ürünler
  ls_urun-kod = 'U01'. ls_urun-ad = 'Laptop X1'.    ls_urun-fiyat = 15000. ls_urun-stok = 5.   APPEND ls_urun TO lt_urunler.
  ls_urun-kod = 'U02'. ls_urun-ad = 'Server Pro'.   ls_urun-fiyat = 50000. ls_urun-stok = 2.   APPEND ls_urun TO lt_urunler.
  ls_urun-kod = 'U03'. ls_urun-ad = 'Tablet Mini'.  ls_urun-fiyat = 8000.  ls_urun-stok = 100. APPEND ls_urun TO lt_urunler.

  " Satış Geçmişi
  ls_satis-belge_no = 'DOC-001'. ls_satis-musteri_id = 101. ls_satis-urun_kod = 'U02'. ls_satis-adet = 1. ls_satis-tutar = 50000. ls_satis-tarih = '20240110'. APPEND ls_satis TO lt_satislar.
  ls_satis-belge_no = 'DOC-002'. ls_satis-musteri_id = 103. ls_satis-urun_kod = 'U03'. ls_satis-adet = 5. ls_satis-tutar = 40000. ls_satis-tarih = '20240205'. APPEND ls_satis TO lt_satislar.
  ls_satis-belge_no = 'DOC-003'. ls_satis-musteri_id = 102. ls_satis-urun_kod = 'U01'. ls_satis-adet = 2. ls_satis-tutar = 30000. ls_satis-tarih = '20240215'. APPEND ls_satis TO lt_satislar.
  ls_satis-belge_no = 'DOC-004'. ls_satis-musteri_id = 101. ls_satis-urun_kod = 'U03'. ls_satis-adet = 1. ls_satis-tutar = 8000.  ls_satis-tarih = '20240301'. APPEND ls_satis TO lt_satislar.


  WRITE: '🚀 ERP SİSTEMİ BAŞLATILIYOR...'.
  WRITE: /.

  " --- 5. İŞ ZEKASI MOTORU (BUSINESS LOGIC) ---
  LOOP AT lt_satislar INTO ls_satis.

    " A. Filtreleme (Giriş Ekranı Kontrolleri)
    IF p_belge IS NOT INITIAL AND ls_satis-belge_no <> p_belge.
       CONTINUE.
    ENDIF.
    
    IF ls_satis-tutar < p_limit.
       CONTINUE. " Limit altı siparişleri gösterme
    ENDIF.

    " B. Veri Zenginleştirme (JOIN Mantığı)
    CLEAR ls_rapor.
    ls_rapor-belge_no = ls_satis-belge_no.
    ls_rapor-adet     = ls_satis-adet.
    ls_rapor-toplam   = ls_satis-tutar.
    ls_rapor-tarih    = ls_satis-tarih.

    " Müşteri Bilgisini Bul
    READ TABLE lt_musteriler ASSIGNING <fs_mus> WITH KEY id = ls_satis-musteri_id.
    IF sy-subrc = 0.
       " Şehir Filtresi
       IF p_sehir IS NOT INITIAL AND <fs_mus>-sehir <> p_sehir.
          CONTINUE.
       ENDIF.
       ls_rapor-musteri_ad = <fs_mus>-ad.
       ls_rapor-sehir      = <fs_mus>-sehir.
    ENDIF.

    " Ürün Bilgisini Bul
    READ TABLE lt_urunler ASSIGNING <fs_urun> WITH KEY kod = ls_satis-urun_kod.
    IF sy-subrc = 0.
       ls_rapor-urun_ad = <fs_urun>-ad.
       
       " Stok Uyarısı (Opsiyonel)
       IF p_stok = 'X' AND <fs_urun>-stok < 5.
          WRITE: / |⚠️ UYARI: { <fs_urun>-ad } stoğu kritik seviyede! ({ <fs_urun>-stok } adet)|.
       ENDIF.
    ENDIF.

    " C. Durum İkonu Belirleme
    IF ls_rapor-toplam > 40000.
       ls_rapor-durum = '🔥 VIP'.
    ELSE.
       ls_rapor-durum = '🟢 STD'.
    ENDIF.

    APPEND ls_rapor TO lt_rapor.
  ENDLOOP.

  " --- 6. ANALİZ MODU (ÖZET RAPOR) ---
  IF p_analiz = 'X'.
     DATA: lv_toplam_ciro TYPE i.
     LOOP AT lt_rapor INTO ls_rapor.
        lv_toplam_ciro = lv_toplam_ciro + ls_rapor-toplam.
     ENDLOOP.
     
     WRITE: /.
     WRITE: '📊 FİNANSAL ÖZET:'.
     WRITE: / |Toplam Ciro: { lv_toplam_ciro } TL|.
     WRITE: / |Listelenen Sipariş: { lines( lt_rapor ) } adet|.
     WRITE: '--------------------------------------------------'.
  ENDIF.

  " --- 7. FİNAL ÇIKTI (ALV) ---
  WRITE: /.
  WRITE: 'Rapor oluşturuldu. ALV Grid üzerinden inceleyebilirsiniz.'.
  cl_demo_output=>display( lt_rapor ).`,
  },
];
