export const unit8 = [
  {
    id: "u8-l1",
    tcode: "Z_PROFILE",
    title: "1. Personel Kayıt Kartı (Temel Girişler)",
    desc: "Farklı veri tiplerini (Metin, Sayı, Tarih) kullanarak giriş ekranı tasarlamak.",
    code: `REPORT z_unit8_profile.

* --- GİRİŞ EKRANI (SELECTION SCREEN) ---
* ABAP'ta kullanıcıdan veri almak için PARAMETERS kullanılır.
* Değişken adları genelde 'p_' ile başlar.

PARAMETERS: p_ad    TYPE string,       " Ad Soyad
            p_unvan TYPE string,       " Görevi
            p_yas   TYPE i,            " Yaş (Tam Sayı)
            p_giris TYPE d.            " İşe Giriş Tarihi

START-OF-SELECTION.
  " Simülasyon: Kullanıcı verileri Pop-up'tan girdi ve F8'e bastı.
  
  WRITE: / '--- PERSONEL BİLGİ KARTI ---'.
  WRITE: /.
  
  " 1. Basit Yazdırma
  WRITE: / |Ad Soyad : { p_ad }|.
  WRITE: / |Ünvan    : { p_unvan }|.
  WRITE: / |Yaş      : { p_yas }|.
  WRITE: / |Giriş Trh: { p_giris DATE = USER }|. " Kullanıcı formatında tarih

  WRITE: /.
  WRITE: '---------------------------------'.

  " 2. Mantıksal Kontrol
  " Emekliliğe ne kadar kaldı? (Basit hesap: 65 - Yaş)
  DATA: lv_kalan TYPE i.
  
  IF p_yas > 0.
    lv_kalan = 65 - p_yas.
    IF lv_kalan > 0.
       WRITE: / |Emekliliğe kalan süre: { lv_kalan } yıl.|.
    ELSE.
       WRITE: / 'Personel emeklilik hakkı kazanmıştır. 🏖️'.
    ENDIF.
  ENDIF.`,
  },
  {
    id: "u8-l2",
    tcode: "Z_CALC",
    title: "2. Hesap Makinesi (Radio Button & Logic)",
    desc: "Kullanıcının seçimine göre (Topla/Çıkar) işlem yapan program.",
    code: `REPORT z_unit8_calc.

* --- GİRİŞ EKRANI ---
PARAMETERS: p_sayi1 TYPE i,
            p_sayi2 TYPE i.

* Kullanıcıya seçenek sunmak için RADIOBUTTON kullanılır.
* Aynı grupta (grp1) olanlardan sadece biri seçilebilir.
PARAMETERS: p_topla RADIOBUTTON GROUP grp1, " Toplama Modu
            p_cikar RADIOBUTTON GROUP grp1, " Çıkarma Modu
            p_carp  RADIOBUTTON GROUP grp1. " Çarpma Modu

DATA: gv_sonuc TYPE i.

START-OF-SELECTION.
  WRITE: '--- İŞLEM RAPORU ---'.
  WRITE: /.

  " Hangi butonun seçildiğini kontrol edelim
  " Seçilen butonun değeri 'X' olur.

  IF p_topla = 'X'.
    gv_sonuc = p_sayi1 + p_sayi2.
    WRITE: |İşlem: { p_sayi1 } + { p_sayi2 }|.
    WRITE: / |SONUÇ: { gv_sonuc }|.

  ELSEIF p_cikar = 'X'.
    gv_sonuc = p_sayi1 - p_sayi2.
    WRITE: |İşlem: { p_sayi1 } - { p_sayi2 }|.
    WRITE: / |SONUÇ: { gv_sonuc }|.

  ELSEIF p_carp = 'X'.
    gv_sonuc = p_sayi1 * p_sayi2.
    WRITE: |İşlem: { p_sayi1 } x { p_sayi2 }|.
    WRITE: / |SONUÇ: { gv_sonuc }|.

  ENDIF.`,
  },
  {
    id: "u8-l3",
    tcode: "Z_VALIDATE",
    title: "3. Zorunlu Alan ve Kontrol (Validation)",
    desc: "Kullanıcı veriyi eksik veya hatalı girerse ne olur?",
    code: `REPORT z_unit8_validate.

* --- GİRİŞ EKRANI ---
* OBLIGATORY: Zorunlu alan demektir (Simülasyonda kodla kontrol edeceğiz).
PARAMETERS: p_kadi  TYPE string, " Kullanıcı Adı
            p_sifre TYPE string. " Şifre

START-OF-SELECTION.
  
  " 1. BOŞ ALAN KONTROLÜ (Validation)
  " Kullanıcı adını boş geçerse programı durdur.
  IF p_kadi IS INITIAL.
    WRITE: '🛑 HATA: Kullanıcı adı boş olamaz!'.
    WRITE: / 'Lütfen geri dönüp alanı doldurunuz.'.
    EXIT. " Programı burada keser, aşağıya inmez.
  ENDIF.

  " 2. ŞİFRE GÜVENLİK KONTROLÜ
  " Şifre '1234' ise kabul etme.
  IF p_sifre = '1234' OR p_sifre = 'admin'.
    WRITE: '⚠️ GÜVENLİK UYARISI:'.
    WRITE: / 'Bu şifre çok basit! Giriş reddedildi.'.
    EXIT.
  ENDIF.

  " 3. BAŞARILI GİRİŞ
  WRITE: |Giriş Başarılı! Hoşgeldin, { p_kadi }.|.
  WRITE: / 'Sisteme yönlendiriliyorsunuz...'.`,
  },
  {
    id: "u8-l4",
    tcode: "Z_SALES_REP",
    title: "4. Proje: Satış Filtreleme Raporu",
    desc: "Belirli bir tutarın üzerindeki satışları ve belirli kategoriyi filtreleme.",
    code: `REPORT z_unit8_project.

* --- VERİ YAPISI ---
TYPES: BEGIN OF ty_satis,
         belge_no TYPE string,
         musteri  TYPE string,
         kategori TYPE string,
         tutar    TYPE i,
         para_bir TYPE string,
       END OF ty_satis.

DATA: lt_satislar TYPE TABLE OF ty_satis,
      lt_rapor    TYPE TABLE OF ty_satis,
      ls_satis    TYPE ty_satis.

* --- GİRİŞ EKRANI (FİLTRELER) ---
* Kullanıcı raporu nasıl kısıtlamak istiyor?
PARAMETERS: p_kat TYPE string,  " Hangi Kategori? (Örn: GIDA, TEKNOLOJI)
            p_min TYPE i.       " Minimum Tutar ne olsun?

START-OF-SELECTION.
  " 1. VERİ HAZIRLIĞI (Mock Data)
  ls_satis-belge_no = 'DOC100'. ls_satis-musteri = 'Migros'. ls_satis-kategori = 'GIDA'.      ls_satis-tutar = 5000.  ls_satis-para_bir = 'TRY'. APPEND ls_satis TO lt_satislar.
  ls_satis-belge_no = 'DOC101'. ls_satis-musteri = 'Bimeks'. ls_satis-kategori = 'TEKNOLOJI'. ls_satis-tutar = 15000. ls_satis-para_bir = 'TRY'. APPEND ls_satis TO lt_satislar.
  ls_satis-belge_no = 'DOC102'. ls_satis-musteri = 'Şok'.    ls_satis-kategori = 'GIDA'.      ls_satis-tutar = 2000.  ls_satis-para_bir = 'TRY'. APPEND ls_satis TO lt_satislar.
  ls_satis-belge_no = 'DOC103'. ls_satis-musteri = 'Vatan'.  ls_satis-kategori = 'TEKNOLOJI'. ls_satis-tutar = 45000. ls_satis-para_bir = 'TRY'. APPEND ls_satis TO lt_satislar.
  ls_satis-belge_no = 'DOC104'. ls_satis-musteri = 'LCW'.    ls_satis-kategori = 'GIYIM'.     ls_satis-tutar = 8000.  ls_satis-para_bir = 'TRY'. APPEND ls_satis TO lt_satislar.

  " Bilgilendirme
  WRITE: |🔍 FİLTRE: Kategori = { p_kat }, Min Tutar = { p_min } TL|.
  WRITE: /.

  " 2. FİLTRELEME MOTORU
  LOOP AT lt_satislar INTO ls_satis.
    
    " Kural 1: Kategori Filtresi (Eğer kullanıcı boş bıraktıysa hepsini getir)
    IF p_kat IS NOT INITIAL AND ls_satis-kategori <> p_kat.
      CONTINUE. " Kategori uymuyorsa pas geç
    ENDIF.

    " Kural 2: Minimum Tutar Kontrolü
    IF ls_satis-tutar < p_min.
      CONTINUE. " Tutar, istenen minimumdan azsa pas geç
    ENDIF.

    " Kuralları geçtiyse rapora ekle
    APPEND ls_satis TO lt_rapor.

  ENDLOOP.

  " 3. SONUÇ GÖSTERİMİ
  IF lt_rapor IS INITIAL.
     WRITE: 'Aradığınız kriterlere uygun kayıt bulunamadı.'.
  ELSE.
     WRITE: 'Rapor hazırlandı. Tabloyu görmek için ALV sekmesine geçiniz.'.
     cl_demo_output=>display( lt_rapor ).
  ENDIF.`,
  },
];
