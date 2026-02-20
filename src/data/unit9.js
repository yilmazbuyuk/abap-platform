export const unit9 = [
  {
    id: "u9-l1",
    tcode: "Z_INSERT",
    title: "1. Veri Ekleme (INSERT & Kontrol)",
    desc: "Mükerrer kontrolü yaparak tabloya yeni veri eklemek.",
    code: `REPORT z_unit9_insert.

* --- VERİ YAPISI ---
TYPES: BEGIN OF ty_kisi,
         id    TYPE i,
         ad    TYPE string,
         soyad TYPE string,
       END OF ty_kisi.

DATA: lt_db   TYPE TABLE OF ty_kisi,
      ls_kisi TYPE ty_kisi.

* --- GİRİŞ EKRANI ---
PARAMETERS: p_id    TYPE i,
            p_ad    TYPE string,
            p_soyad TYPE string.

START-OF-SELECTION.
  " 1. MOCK DATA (Mevcut Veriler)
  ls_kisi-id = 101. ls_kisi-ad = 'Ali'.   ls_kisi-soyad = 'Can'.   APPEND ls_kisi TO lt_db.
  ls_kisi-id = 102. ls_kisi-ad = 'Veli'.  ls_kisi-soyad = 'Han'.   APPEND ls_kisi TO lt_db.

  " --- ÖNCEKİ DURUM (KONSOL) ---
  WRITE: '--- 1. İŞLEM ÖNCESİ TABLO DURUMU ---'.
  LOOP AT lt_db INTO ls_kisi.
    WRITE: / |ID: { ls_kisi-id } - { ls_kisi-ad } { ls_kisi-soyad }|.
  ENDLOOP.
  WRITE: /.
  WRITE: '--------------------------------------'.

  " 2. INSERT MANTIĞI
  " Kural: Aynı ID ile kayıt varsa ekleme yapma!
  READ TABLE lt_db INTO ls_kisi WITH KEY id = p_id.
  
  IF sy-subrc = 0.
    WRITE: / |🛑 HATA: { p_id } numaralı kayıt zaten var!|.
    WRITE: / 'Tabloda değişiklik yapılmadı.'.
  ELSE.
    " Kayıt yoksa ekleyebiliriz.
    ls_kisi-id    = p_id.
    ls_kisi-ad    = p_ad.
    ls_kisi-soyad = p_soyad.
    
    APPEND ls_kisi TO lt_db. 
    
    WRITE: / |✅ BAŞARILI: { p_ad } { p_soyad } sisteme eklendi.|.
    WRITE: / 'Güncel tabloyu görmek için ALV sekmesine geçiniz.'.
  ENDIF.

  " --- SONRAKİ DURUM (GRID) ---
  cl_demo_output=>display( lt_db ).`,
  },
  {
    id: "u9-l2",
    tcode: "Z_UPDATE",
    title: "2. Veri Güncelleme (UPDATE & MODIFY)",
    desc: "Var olan bir personelin maaşını güncellemek.",
    code: `REPORT z_unit9_update.

TYPES: BEGIN OF ty_personel,
         sicil TYPE i,
         ad    TYPE string,
         maas  TYPE i,
       END OF ty_personel.

DATA: lt_db   TYPE TABLE OF ty_personel,
      ls_per  TYPE ty_personel.

* --- GİRİŞ EKRANI ---
PARAMETERS: p_sicil TYPE i, " Hangi personel?
            p_zam   TYPE i. " Ne kadar zam?

FIELD-SYMBOLS: <fs_per> TYPE ty_personel.

START-OF-SELECTION.
  " 1. Mock Data
  ls_per-sicil = 1. ls_per-ad = 'Ahmet'. ls_per-maas = 10000. APPEND ls_per TO lt_db.
  ls_per-sicil = 2. ls_per-ad = 'Ayşe'.  ls_per-maas = 12000. APPEND ls_per TO lt_db.
  ls_per-sicil = 3. ls_per-ad = 'Mehmet'. ls_per-maas = 9000. APPEND ls_per TO lt_db.

  " --- ÖNCEKİ DURUM (KONSOL) ---
  WRITE: '--- 1. İŞLEM ÖNCESİ MAAŞLAR ---'.
  LOOP AT lt_db INTO ls_per.
    WRITE: / |Sicil: { ls_per-sicil } | & 
             |Ad: { ls_per-ad WIDTH = 10 } | & 
             |Maaş: { ls_per-maas } TL|.
  ENDLOOP.
  WRITE: /.

  WRITE: |🔍 Talep: { p_sicil } nolu personele { p_zam } TL zam yapılacak.|.
  WRITE: /.

  " 2. UPDATE MANTIĞI
  READ TABLE lt_db ASSIGNING <fs_per> WITH KEY sicil = p_sicil.

  IF sy-subrc = 0.
    WRITE: / |Eski Maaş: { <fs_per>-maas } TL|.
    
    " Güncelleme işlemi
    <fs_per>-maas = <fs_per>-maas + p_zam.
    
    WRITE: / |✅ Yeni Maaş: { <fs_per>-maas } TL (Güncellendi)|.
  ELSE.
    WRITE: / |🛑 HATA: { p_sicil } sicil numaralı personel bulunamadı.|.
  ENDIF.

  " --- SONRAKİ DURUM (GRID) ---
  cl_demo_output=>display( lt_db ).`,
  },
  {
    id: "u9-l3",
    tcode: "Z_DELETE",
    title: "3. Veri Silme (DELETE)",
    desc: "Belirli bir ID'ye sahip ürünü listeden silmek.",
    code: `REPORT z_unit9_delete.

TYPES: BEGIN OF ty_urun,
         id    TYPE i,
         ad    TYPE string,
         stok  TYPE i,
       END OF ty_urun.

DATA: lt_stok TYPE TABLE OF ty_urun,
      ls_urun TYPE ty_urun.

* --- GİRİŞ EKRANI ---
PARAMETERS: p_sil_id TYPE i. " Silinecek ID

START-OF-SELECTION.
  " 1. Mock Data
  ls_urun-id = 50. ls_urun-ad = 'Kalem'.  ls_urun-stok = 100. APPEND ls_urun TO lt_stok.
  ls_urun-id = 51. ls_urun-ad = 'Silgi'.  ls_urun-stok = 0.   APPEND ls_urun TO lt_stok.
  ls_urun-id = 52. ls_urun-ad = 'Defter'. ls_urun-stok = 50.  APPEND ls_urun TO lt_stok.

  " --- ÖNCEKİ DURUM (KONSOL) ---
  WRITE: '--- 1. İŞLEM ÖNCESİ STOK LİSTESİ ---'.
  LOOP AT lt_stok INTO ls_urun.
     WRITE: / |ID: { ls_urun-id } - { ls_urun-ad } (Stok: { ls_urun-stok })|.
  ENDLOOP.

  WRITE: /.
  WRITE: |🗑️ Silme Talebi ID: { p_sil_id }|.

  " 2. DELETE MANTIĞI
  DELETE lt_stok WHERE id = p_sil_id.

  IF sy-subrc = 0.
    WRITE: / '✅ Kayıt başarıyla silindi.'.
  ELSE.
    WRITE: / '⚠️ Uyarı: Silinecek kayıt bulunamadı.'.
  ENDIF.

  " EKSTRA: Stoğu 0 olanları da otomatik temizleyelim
  DELETE lt_stok WHERE stok = 0.
  IF sy-subrc = 0.
     WRITE: / 'ℹ️ Bilgi: Stoğu 0 olan atıl ürünler de temizlendi.'.
  ENDIF.

  " --- SONRAKİ DURUM (GRID) ---
  cl_demo_output=>display( lt_stok ).`,
  },
  {
    id: "u9-l4",
    tcode: "Z_STOCK_MNG",
    title: "4. Proje: Stok Hareket Yönetimi",
    desc: "Mal Girişi (+) veya Mal Çıkışı (-) yaparak stoğu yöneten proje.",
    code: `REPORT z_unit9_project.

* --- VERİ YAPISI ---
TYPES: BEGIN OF ty_malzeme,
         kod   TYPE string,
         ad    TYPE string,
         stok  TYPE i,
       END OF ty_malzeme.

DATA: lt_depo TYPE TABLE OF ty_malzeme,
      ls_mal  TYPE ty_malzeme.

FIELD-SYMBOLS: <fs_mal> TYPE ty_malzeme.

* --- GİRİŞ EKRANI ---
PARAMETERS: p_kod   TYPE string,
            p_adet  TYPE i,
            p_giris RADIOBUTTON GROUP grp1,
            p_cikis RADIOBUTTON GROUP grp1.

START-OF-SELECTION.
  " 1. DEPO DURUMU
  ls_mal-kod = 'M01'. ls_mal-ad = 'Laptop'. ls_mal-stok = 10. APPEND ls_mal TO lt_depo.
  ls_mal-kod = 'M02'. ls_mal-ad = 'Mouse'.  ls_mal-stok = 50. APPEND ls_mal TO lt_depo.
  ls_mal-kod = 'M03'. ls_mal-ad = 'Klavye'. ls_mal-stok = 5.  APPEND ls_mal TO lt_depo.

  WRITE: '--- İŞLEM LOGLARI ---'.
  WRITE: / |📦 İşlem: Malzeme={ p_kod }, Adet={ p_adet }|.

  " 2. İŞLEM MOTORU
  READ TABLE lt_depo ASSIGNING <fs_mal> WITH KEY kod = p_kod.

  IF sy-subrc <> 0.
    WRITE: / '🛑 HATA: Malzeme depoda bulunamadı!'.
    " Hata durumunda bile mevcut listeyi gösterelim
    cl_demo_output=>display( lt_depo ).
    RETURN.
  ENDIF.

  WRITE: / |Ürün Bulundu: { <fs_mal>-ad } (Mevcut Stok: { <fs_mal>-stok })|.

  " 3. GİRİŞ / ÇIKIŞ
  IF p_giris = 'X'.
     <fs_mal>-stok = <fs_mal>-stok + p_adet.
     WRITE: / |➕ Mal girişi yapıldı.|.

  ELSEIF p_cikis = 'X'.
     IF <fs_mal>-stok < p_adet.
        WRITE: / '🛑 HATA: Yetersiz Stok! Çıkış yapılamaz.'.
     ELSE.
        <fs_mal>-stok = <fs_mal>-stok - p_adet.
        WRITE: / |➖ Mal çıkışı yapıldı.|.
        
        IF <fs_mal>-stok < 5.
           WRITE: / '⚠️ UYARI: Stok kritik seviyenin altına düştü!'.
        ENDIF.
     ENDIF.
  ENDIF.

  " 4. ALV ÇIKTISI
  cl_demo_output=>display( lt_depo ).`,
  },
];
