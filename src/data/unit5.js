export const unit5 = [
  {
    id: "u5-l1",
    tcode: "SE38",
    title: "1. Veri Temizleme (SORT & DELETE)",
    desc: "Tablodaki tekrar eden (mükerrer) kayıtları silmek.",
    code: `REPORT z_unit5_clean.

TYPES: BEGIN OF ty_liste,
         ulke  TYPE string,
         sehir TYPE string,
       END OF ty_liste.

DATA: lt_yerler TYPE TABLE OF ty_liste,
      ls_yer    TYPE ty_liste.

START-OF-SELECTION.
  " 1. Karışık ve Tekrarlı Veri
  ls_yer-ulke = 'TR'. ls_yer-sehir = 'Istanbul'. APPEND ls_yer TO lt_yerler.
  ls_yer-ulke = 'DE'. ls_yer-sehir = 'Berlin'.   APPEND ls_yer TO lt_yerler.
  ls_yer-ulke = 'TR'. ls_yer-sehir = 'Istanbul'. APPEND ls_yer TO lt_yerler.
  ls_yer-ulke = 'TR'. ls_yer-sehir = 'Ankara'.   APPEND ls_yer TO lt_yerler.
  ls_yer-ulke = 'DE'. ls_yer-sehir = 'Berlin'.   APPEND ls_yer TO lt_yerler.

  WRITE: '--- Temizlik Öncesi ---'.
  LOOP AT lt_yerler INTO ls_yer.
    WRITE: / ls_yer-ulke, ls_yer-sehir.
  ENDLOOP.

  " 2. TEMİZLİK İŞLEMİ
  " Duplicate silmek için önce sıralamak ŞARTTIR!
  SORT lt_yerler BY ulke sehir.

  " Yan yana duran aynılardan birini siler.
  DELETE ADJACENT DUPLICATES FROM lt_yerler COMPARING ulke sehir.

  WRITE: /.
  WRITE: '--- Temizlik Sonrası ---'.
  LOOP AT lt_yerler INTO ls_yer.
    WRITE: / ls_yer-ulke, ls_yer-sehir.
  ENDLOOP.`,
  },
  {
    id: "u5-l2",
    tcode: "SE38",
    title: "2. Algoritmik Özetleme (READ & MODIFY)",
    desc: "Manuel toplama mantığı: Varsa üzerine ekle, yoksa yeni satır aç.",
    code: `REPORT z_unit5_algo.

TYPES: BEGIN OF ty_satis,
         bolge TYPE string,
         tutar TYPE i,
       END OF ty_satis.

DATA: lt_ham_veri TYPE TABLE OF ty_satis,
      lt_ozet     TYPE TABLE OF ty_satis,
      ls_veri     TYPE ty_satis,
      ls_ozet     TYPE ty_satis.

START-OF-SELECTION.
  " Veri Hazırlığı (Ege toplamı 350 olmalı)
  ls_veri-bolge = 'Ege'.     ls_veri-tutar = 100. APPEND ls_veri TO lt_ham_veri.
  ls_veri-bolge = 'Marmara'. ls_veri-tutar = 500. APPEND ls_veri TO lt_ham_veri.
  ls_veri-bolge = 'Ege'.     ls_veri-tutar = 200. APPEND ls_veri TO lt_ham_veri.
  ls_veri-bolge = 'Ege'.     ls_veri-tutar = 50.  APPEND ls_veri TO lt_ham_veri.

  WRITE: '--- Hesaplama Başlıyor ---'.

  " --- MANUEL TOPLAMA ALGORİTMASI ---
  LOOP AT lt_ham_veri INTO ls_veri.
    
    " 1. Bu bölge daha önce listeye eklendi mi?
    CLEAR ls_ozet.
    READ TABLE lt_ozet INTO ls_ozet WITH KEY bolge = ls_veri-bolge.

    IF sy-subrc = 0.
      " SENARYO A: Zaten var. Tutarı üzerine ekle ve tabloyu güncelle.
      ls_ozet-tutar = ls_ozet-tutar + ls_veri-tutar.
      
      " Güncelleme (sy-tabix: Bulunan satırın index numarası)
      MODIFY lt_ozet FROM ls_ozet INDEX sy-tabix.
    
    ELSE.
      " SENARYO B: İlk defa geldi. Yeni satır olarak ekle.
      ls_ozet-bolge = ls_veri-bolge.
      ls_ozet-tutar = ls_veri-tutar.
      APPEND ls_ozet TO lt_ozet.
    ENDIF.

  ENDLOOP.

  WRITE: /.
  WRITE: '--- Sonuç Tablosu ---'.
  
  LOOP AT lt_ozet INTO ls_ozet.
    WRITE: / ls_ozet-bolge, 'Toplam:', ls_ozet-tutar.
  ENDLOOP.`,
  },
  {
    id: "u5-l3",
    tcode: "SE38",
    title: "3. Performans Yönetimi (FIELD-SYMBOLS)",
    desc: "ABAP'ın Pointer'ı. Veriyi kopyalamadan yerinde değiştirmek.",
    code: `REPORT z_unit5_fs.

TYPES: BEGIN OF ty_urun,
         ad    TYPE string,
         fiyat TYPE i,
       END OF ty_urun.

DATA: lt_urunler TYPE TABLE OF ty_urun,
      ls_urun    TYPE ty_urun.

" Field Symbol Tanımı (< > işaretleri ile gösterilir)
FIELD-SYMBOLS: <fs_urun> TYPE ty_urun.

START-OF-SELECTION.
  ls_urun-ad = 'Laptop'. ls_urun-fiyat = 1000. APPEND ls_urun TO lt_urunler.
  ls_urun-ad = 'Mouse'.  ls_urun-fiyat = 50.   APPEND ls_urun TO lt_urunler.

  WRITE: 'Eski Fiyatlar:', 1000, 50.

  " --- YENİ YÖNTEM (HIZLI - FIELD SYMBOL) ---
  " INTO yerine ASSIGNING kullanıyoruz.
  " Bu sayede <fs_urun> direkt tablonun hafızadaki adresine bakar.
  
  LOOP AT lt_urunler ASSIGNING <fs_urun>.
    " %10 Zam Yapalım
    " DİKKAT: MODIFY komutuna gerek yok! Direkt hafızayı değiştirdik.
    <fs_urun>-fiyat = <fs_urun>-fiyat * 110 / 100.
  ENDLOOP.

  WRITE: /.
  WRITE: '--- Zamlı Fiyatlar (Field Symbol ile) ---'.
  
  LOOP AT lt_urunler INTO ls_urun.
    WRITE: / ls_urun-ad, ls_urun-fiyat.
  ENDLOOP.`,
  },
  {
    id: "u5-l4",
    tcode: "SE38",
    title: "4. Hata Yönetimi (TRY-CATCH)",
    desc: "Programın çökmesini (Dump) engellemek.",
    code: `REPORT z_unit5_try.

DATA: lv_sayi1 TYPE i,
      lv_sayi2 TYPE i,
      lv_sonuc TYPE p DECIMALS 2.

START-OF-SELECTION.
  lv_sayi1 = 100.
  lv_sayi2 = 0. " Sıfıra bölme hatası yaratacağız!

  WRITE: 'Bölme işlemi başlıyor...'.

  " HATA YAKALAMA BLOĞU
  TRY.
      " Riskli kod buraya yazılır
      lv_sonuc = lv_sayi1 / lv_sayi2.
      WRITE: / 'Sonuç:', lv_sonuc.

    CATCH cx_root.
      " Hata olursa burası çalışır
      WRITE: /.
      WRITE: '🛑 HATA: Matematiksel bir hata oluştu (Sıfıra Bölme).'.
      WRITE: / 'Program çökmeden kurtarıldı.'.
      
  ENDTRY.

  WRITE: /.
  WRITE: 'Program normal şekilde sonlandı.'.`,
  },
];
