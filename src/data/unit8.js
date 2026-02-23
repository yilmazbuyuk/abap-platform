export const unit8 = [
  {
    id: "u8-l1",
    tcode: "Z_PROFILE",
    title: "1. Personel Kayıt Kartı (Selection Screen)",
    desc: "Kullanıcıdan veri almak için PARAMETERS kullanımı ve giriş ekranı tasarımı.",
    code: `REPORT z_ders_u8_1_profile.

* ======================================================================
* SELECTION SCREEN (SEÇİM EKRANI) NEDİR?
* Kullanıcının programı çalıştırmadan önce filtreleme yapabildiği veya 
* veri girişi yapabildiği ekrandır. ABAP'ta en temel giriş komutu 
* PARAMETERS'tır. Bu komut, ekranda tek bir giriş alanı oluşturur.
* ======================================================================

" PARAMETERS: Kullanıcıdan tekil değerler almak için kullanılır.
" İsimlendirme standardı olarak genelde 'p_' prefix'i tercih edilir.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  PARAMETERS: p_ad    TYPE string,       " Metin girişi
              p_unvan TYPE string,       " Metin girişi
              p_yas   TYPE i,            " Tam sayı girişi
              p_giris TYPE d DEFAULT sy-datum. " Tarih girişi (Varsayılan bugün)
SELECTION-SCREEN END OF BLOCK b1.

START-OF-SELECTION.
  

* ======================================================================
* PROGRAMIN ÇALIŞMA MANTIĞI
* Kullanıcı girişleri yapıp F8 (Execute) tuşuna bastığında 
* START-OF-SELECTION bloğu tetiklenir ve p_ ile başlayan değişkenler 
* kullanıcının girdiği değerlerle dolar.
* ======================================================================

  WRITE: '📋 PERSONEL DETAYLI BİLGİ KARTI'.
  WRITE: / '--------------------------------------------------'.
  
  " Kullanıcı verilerini şık bir formatta ekrana basalım
  WRITE: / |Personel Adı : { p_ad }|.
  WRITE: / |Mevcut Ünvan : { p_unvan }|.
  WRITE: / |Güncel Yaş   : { p_yas }|.
  
  " Tarihi kullanıcının kendi SAP ayarlarındaki formatta gösterelim
  WRITE: / |İşe Giriş    : { p_giris DATE = USER }|.

  WRITE: /.
  WRITE: / '--- 🏖️ EMEKLİLİK ANALİZİ ---'.
  WRITE: / '--------------------------------------------------'.

  " BASİT BİR HESAPLAMA MANTIĞI
  " Emeklilik yaşı 65 kabul edilirse kalan süreyi hesaplayalım.
  DATA: lv_kalan_yil TYPE i.
  
  IF p_yas > 0.
    lv_kalan_yil = 65 - p_yas.
    
    IF lv_kalan_yil > 0.
       WRITE: / |Emekliliğe kalan tahmini süre: { lv_kalan_yil } yıl.|.
       WRITE: / 'Çalışmaya devam! 💪'.
    ELSE.
       WRITE: / '⚠️ Bu personel emeklilik yaş haddini doldurmuştur.'.
       WRITE: / 'İşlemler başlatılabilir. 🏖️'.
    ENDIF.
  ELSE.
    WRITE: / '❌ Geçersiz yaş girişi yapıldı.'.
  ENDIF.

* ======================================================================
* İPUCU: Selection Screen'deki p_ad gibi teknik isimleri "Ad Soyad" gibi 
* anlaşılır etiketlere çevirmek için SAP'de "Text Elements" kullanılır.
* ======================================================================`,
  },
  {
    id: "u8-l2",
    tcode: "Z_CALC",
    title: "2. Hesap Makinesi (Radio Button & Logic)",
    desc: "Kullanıcı seçimlerine göre farklı algoritmalar çalıştırmak: Radio Button ve Case-Control mantığı.",
    code: `REPORT z_ders_u8_2_hesap_makinesi.

* ======================================================================
* SELECTION SCREEN: RADIO BUTTON MANTIĞI
* Radio Button'lar kullanıcıya birbirini dışlayan (Exclusive) seçenekler 
* sunar. 'GROUP' eklentisi, hangi butonların birbirine bağlı olduğunu 
* belirler. Aynı gruptaki butonlardan sadece BİRİ 'X' değerini alabilir.
* ======================================================================

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  PARAMETERS: p_sayi1 TYPE i,
              p_sayi2 TYPE i.
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-002.
  " DEFAULT 'X': Program ilk açıldığında toplama butonunun seçili gelmesini sağlar.
  PARAMETERS: p_topla RADIOBUTTON GROUP grp1 DEFAULT 'X',
              p_cikar RADIOBUTTON GROUP grp1,
              p_carp  RADIOBUTTON GROUP grp1,
              p_bol   RADIOBUTTON GROUP grp1.
SELECTION-SCREEN END OF BLOCK b2.

DATA: gv_sonuc TYPE p DECIMALS 2.

START-OF-SELECTION.
  
  WRITE: '🧮 ABAP AKILLI HESAP MAKİNESİ'.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* İŞLEM KARAR MEKANİZMASI
* Seçilen butonun değeri otomatik olarak 'X' (Abap_true) olur. 
* IF/ELSEIF blokları ile hangi butonun aktif olduğunu kontrol ederiz.
* ======================================================================

  IF p_topla = 'X'.
    gv_sonuc = p_sayi1 + p_sayi2.
    WRITE: / |İşlem Türü : Toplama (+)|.
    WRITE: / |Matematik  : { p_sayi1 } + { p_sayi2 } = { gv_sonuc }|.

  ELSEIF p_cikar = 'X'.
    gv_sonuc = p_sayi1 - p_sayi2.
    WRITE: / |İşlem Türü : Çıkarma (-)|.
    WRITE: / |Matematik  : { p_sayi1 } - { p_sayi2 } = { gv_sonuc }|.

  ELSEIF p_carp = 'X'.
    gv_sonuc = p_sayi1 * p_sayi2.
    WRITE: / |İşlem Türü : Çarpma (x)|.
    WRITE: / |Matematik  : { p_sayi1 } * { p_sayi2 } = { gv_sonuc }|.

  ELSEIF p_bol = 'X'.
    " Bölme işleminde sıfıra bölme hatasını kontrol edelim (Safe Coding)
    IF p_sayi2 <> 0.
      gv_sonuc = p_sayi1 / p_sayi2.
      WRITE: / |İşlem Türü : Bölme (/)|.
      WRITE: / |Matematik  : { p_sayi1 } / { p_sayi2 } = { gv_sonuc }|.
    ELSE.
      WRITE: / '🛑 HATA: Bir sayıyı sıfıra bölemezsiniz!'.
    ENDIF.

  ENDIF.

  WRITE: / '--------------------------------------------------'.
  WRITE: / '✅ İşlem başarıyla tamamlandı.'.

* ======================================================================
* ÖNEMLİ NOT: Daha temiz bir kod için IF yerine 'CASE' yapısı da 
* kullanılabilir (CASE 'X'. WHEN p_topla. ... ENDCASE.). 
* Ancak yeni başlayanlar için IF yapısı akışı daha net gösterir.
* ======================================================================`,
  },
  {
    id: "u8-l3",
    tcode: "Z_VALIDATE",
    title: "3. Profesyonel Giriş Kontrolü (Smart Validation)",
    desc: "Kullanıcı verilerini rapor başlamadan süzmek: 'Check & Stop' algoritmasıyla hatalı girişi engelleme.",
    code: `REPORT z_ders_u8_3_validation_fixed.

* ======================================================================
* PROFESYONEL VALIDATION (DOĞRULAMA) STRATEJİSİ
* ABAP'ta en güvenli doğrulama yöntemi, START-OF-SELECTION bloğunun 
* en başında tüm kontrolleri yapıp, hata varsa EXIT ile sistemi 
* kilitlemektir. Böylece parser hatalarından kaçınırız.
* ======================================================================

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  " LOWER CASE: Küçük harf duyarlılığını korur (admin vs ADMIN).
  PARAMETERS: p_kadi  TYPE string OBLIGATORY LOWER CASE,
              p_sifre TYPE string OBLIGATORY LOWER CASE.
SELECTION-SCREEN END OF BLOCK b1.

START-OF-SELECTION.
  " 1. ADIM: GÜVENLİK DUVARI (THE WALL)
  " Rapor çalışmadan önce tüm kontrolleri burada yapıyoruz.
  

  DATA: lv_hata_mesaji TYPE string.

  " --- Şifre Kontrolü ---
  IF p_sifre = '1234' OR p_sifre = '123456' OR p_sifre = 'admin'.
    lv_hata_mesaji = '🛑 GÜVENLİK: Çok zayıf bir şifre girdiniz!'.
  ENDIF.

  " --- Kullanıcı Adı Uzunluk Kontrolü ---
  IF strlen( p_kadi ) < 3.
    lv_hata_mesaji = '⚠️ HATA: Kullanıcı adı en az 3 karakter olmalıdır.'.
  ENDIF.

  " --- SONUÇ: HATA VAR MI? ---
  IF lv_hata_mesaji IS NOT INITIAL.
    WRITE: / '--------------------------------------------------'.
    WRITE: / lv_hata_mesaji.
    WRITE: / 'Sistem güvenliği için işlem durduruldu.'.
    WRITE: / '--------------------------------------------------'.
    EXIT. " 🔥 KRİTİK: Hata varsa programın aşağıya inmesini ENGELLER.
  ENDIF.

* ======================================================================
* 2. ADIM: ASIL RAPOR (SADECE KONTROLLER GEÇİLİRSE ÇALIŞIR)
* ======================================================================
  WRITE: '🔐 SİSTEME GİRİŞ BAŞARILI'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Hoş geldin, { p_kadi }!|.
  WRITE: / 'Tüm güvenlik kontrollerinden başarıyla geçtiniz.'.
  WRITE: / 'Yetki seviyeniz: Admin'.

`,
  },
  {
    id: "u8-l4",
    tcode: "Z_SALES_REP",
    title: "4. Proje: Satış Filtreleme Raporu",
    desc: "Kullanıcı parametrelerine göre veriyi ayıklayan, opsiyonel filtreleme ve tutar kontrolü yapan kapsamlı rapor projesi.",
    code: `REPORT z_ders_u8_project_sales.

* ======================================================================
* PROJE: SATIŞ ANALİZ VE FİLTRELEME MOTORU
* Senaryo: Veritabanından (simüle edilen) gelen binlerce satış verisini, 
* kullanıcının istediği kategoriye ve bütçeye göre süzerek raporlamak.
* ======================================================================

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

* ======================================================================
* GİRİŞ EKRANI (SELECTION SCREEN)
* ======================================================================
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  " p_kat boş bırakılırsa tüm kategoriler listelenir (Opsiyonel Filtre).
  PARAMETERS: p_kat TYPE string LOWER CASE, 
              p_min TYPE i DEFAULT 0.      " Varsayılan min tutar 0 TL.
SELECTION-SCREEN END OF BLOCK b1.

START-OF-SELECTION.
 

* ======================================================================
* 1. VERİ HAZIRLIĞI (MOCK DATA)
* ======================================================================
  APPEND VALUE #( belge_no = 'DOC100' musteri = 'Migros' kategori = 'GIDA'      tutar = 5000  para_bir = 'TRY' ) TO lt_satislar.
  APPEND VALUE #( belge_no = 'DOC101' musteri = 'Bimeks' kategori = 'TEKNOLOJI' tutar = 15000 para_bir = 'TRY' ) TO lt_satislar.
  APPEND VALUE #( belge_no = 'DOC102' musteri = 'Şok'    kategori = 'GIDA'      tutar = 2000  para_bir = 'TRY' ) TO lt_satislar.
  APPEND VALUE #( belge_no = 'DOC103' musteri = 'Vatan'  kategori = 'TEKNOLOJI' tutar = 45000 para_bir = 'TRY' ) TO lt_satislar.
  APPEND VALUE #( belge_no = 'DOC104' musteri = 'LCW'    kategori = 'GIYIM'     tutar = 8000  para_bir = 'TRY' ) TO lt_satislar.

  WRITE: '🔍 RAPOR PARAMETRELERİ'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Seçilen Kategori : { p_kat } (Boşsa Tümü)|.
  WRITE: / |Minimum Tutar    : { p_min } TL|.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* 2. FİLTRELEME MOTORU (FILTERING ENGINE)
* Mantık: CONTINUE komutu, kurala uymayan satırı anında geçer ve döngünün 
* başına döner. Bu sayede sadece "temiz" veriler APPEND satırına ulaşır.
* ======================================================================
  LOOP AT lt_satislar INTO ls_satis.
    
    " KURAL 1: Kategori Filtresi
    " Eğer kullanıcı kategori girdiyse VE tablodaki kategori buna uymuyorsa geç.
    IF p_kat IS NOT INITIAL AND ls_satis-kategori <> p_kat.
      CONTINUE.
    ENDIF.

    " KURAL 2: Minimum Tutar Kontrolü
    " Satış tutarı, istenen değerin altındaysa bu satırı rapora alma.
    IF ls_satis-tutar < p_min.
      CONTINUE.
    ENDIF.

    " Tüm kuralları başarıyla geçen satır rapor listesine eklenir.
    APPEND ls_satis TO lt_rapor.

  ENDLOOP.

* ======================================================================
* 3. ÇIKTI YÖNETİMİ
* ======================================================================
  IF lt_rapor IS INITIAL.
    WRITE: / '🛑 UYARI: Aradığınız kriterlere uygun satış kaydı bulunamadı.'.
  ELSE.
    WRITE: / |✅ İşlem Başarılı: { lines( lt_rapor ) } adet kayıt filtrelendi.|.
    WRITE: / 'Detaylar için ALV Grid ekranını inceleyiniz.'.
    
    " Filtrelenmiş listeyi modern formatta gösterelim.
    cl_demo_output=>display( lt_rapor ).
  ENDIF.`,
  },
];
