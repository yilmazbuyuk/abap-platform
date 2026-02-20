export const unit6 = [
  {
    id: "u6-l1",
    tcode: "SE38",
    title: "1. Sistem Değişkenleri (SY-FIELDS)",
    desc: "Sistemin o anki durumunu (Tarih, Saat, Kullanıcı) okumak.",
    code: `REPORT z_unit6_system.

START-OF-SELECTION.
  " ABAP'ta 'SY-' ile başlayan özel bir yapı vardır.
  " Bu yapı, sistemin o anki durumunu tutar.
  " Veri tanımlamaya gerek yoktur, her zaman doludur.

  WRITE: '--- Sistem Bilgileri ---'.
  
  " 1. Kullanıcı Adı (SY-UNAME)
  WRITE: / 'Kullanıcı:', sy-uname.

  " 2. Bugünün Tarihi (SY-DATUM) - YYYYAAGG formatında
  WRITE: / 'Tarih (YılAyGün):', sy-datum.

  " 3. Şu Anki Saat (SY-UZEIT) - SSDDSS formatında
  WRITE: / 'Saat (SaatDakSan):', sy-uzeit.

  " 4. Dil Anahtarı (SY-LANGU)
  WRITE: / 'Sistem Dili:', sy-langu.

  WRITE: /.
  WRITE: '--- Döngü İndeksi (SY-INDEX) ---'.
  DO 3 TIMES.
    " Döngünün kaçıncı turunda olduğumuzu verir.
    WRITE: / 'Tur Sayısı:', sy-index.
  ENDDO.`,
  },
  {
    id: "u6-l2",
    tcode: "SE38",
    title: "2. Tarih Hesaplamaları (Date Math)",
    desc: "Gelecek tarihi bulma ve iki tarih arasındaki farkı alma.",
    code: `REPORT z_unit6_date.

DATA: lv_bugun    TYPE d,       " Tarih Tipi (d)
      lv_vade     TYPE d,
      lv_yilbasi  TYPE d,
      lv_fark     TYPE i.       " Gün farkı tamsayıdır

START-OF-SELECTION.
  lv_bugun = sy-datum. " Bugünün tarihini al

  WRITE: 'Bugün:', lv_bugun.

  " 1. GÜN EKLEME / ÇIKARMA
  " 30 gün sonrası (Vade Tarihi)
  lv_vade = lv_bugun + 30.
  
  WRITE: /.
  WRITE: '30 Gün Sonrası (Vade):', lv_vade.

  " 1 hafta öncesi
  lv_vade = lv_bugun - 7.
  WRITE: / '1 Hafta Öncesi:', lv_vade.

  " 2. İKİ TARİH ARASINDAKİ FARK
  " Yılbaşına kaç gün kaldı?
  " Önce yılbaşını manuel oluşturalım: YYYYAAUU
  lv_yilbasi = '20250101'. 

  " Tarihleri birbirinden çıkarınca sonuç gün sayısıdır.
  lv_fark = lv_yilbasi - lv_bugun.

  WRITE: /.
  WRITE: 'Hedef Tarih:', lv_yilbasi.
  WRITE: / 'Kalan Gün Sayısı:', lv_fark.
  
  IF lv_fark < 0.
    WRITE: / '(Bu tarih geçmişte kalmış!)'.
  ENDIF.`,
  },
  {
    id: "u6-l3",
    tcode: "SE38",
    title: "3. Ayın Son Gününü Bulma (RP_LAST_DAY...)",
    desc: "Fonksiyon kullanarak bir tarihin ay sonunu hesaplamak.",
    code: `REPORT z_unit6_last_day.

DATA: lv_tarih  TYPE d,
      lv_son_gun TYPE d.

START-OF-SELECTION.
  " Rastgele bir tarih verelim (Şubat ayı)
  lv_tarih = '20240210'. 

  WRITE: 'Seçilen Tarih:', lv_tarih.

  " ABAP'ta karmaşık tarih işlemleri için hazır fonksiyonlar/metotlar vardır.
  " Ancak basit bir mantıkla ayın son gününü şöyle bulabiliriz:
  " 1. Gelecek ayın ilk gününü bul.
  " 2. Ondan 1 gün çıkar.

  " Simülasyon mantığı (Basitleştirilmiş):
  " Gerçek hayatta 'RP_LAST_DAY_OF_MONTH' fonksiyonu kullanılır.
  " Biz burada manuel mantık kuralım.
  
  " Adım 1: Tarihin ayını değiştir (Zor olduğu için manuel örnek veriyoruz)
  " Bu örnekte mantıksal ilerliyoruz.
  
  WRITE: /.
  WRITE: 'Bu işlem simülasyon ortamında manuel hesaplanmalıdır.'.
  
  " Şubat 2024 (Artık Yıl)
  IF lv_tarih+0(4) = '2024' AND lv_tarih+4(2) = '02'.
     lv_son_gun = '20240229'.
  ELSE.
     lv_son_gun = '20240228'.
  ENDIF.

  WRITE: / 'Ayın Son Günü:', lv_son_gun.`,
  },
  {
    id: "u6-l4",
    tcode: "ZAGING",
    title: "4. Proje: Vade (Aging) Raporu",
    desc: "Faturaların gecikme durumunu hesaplayan ve raporlayan proje.",
    code: `REPORT z_unit6_project.

* --- TİP TANIMLARI ---
TYPES: BEGIN OF ty_fatura,
         belge_no  TYPE string,
         tarih     TYPE d,
         vade_gun  TYPE i,
         odeme_tar TYPE d,
         durum     TYPE string,
         gecikme   TYPE i,
       END OF ty_fatura.

DATA: lt_faturalar TYPE TABLE OF ty_fatura,
      ls_gecici    TYPE ty_fatura, " Veri eklemek için
      lv_bugun     TYPE d.

" Field Symbol Tanımı (Pointer)
FIELD-SYMBOLS: <ls_fatura> TYPE ty_fatura.

START-OF-SELECTION.
  " Referans Tarih (Bugün)
  " Simülasyon için tarihi sabitliyoruz
  lv_bugun = '20240601'. 

  WRITE: 'Rapor Tarihi:', lv_bugun.
  WRITE: /.

  " --- 1. VERİ HAZIRLIĞI ---
  ls_gecici-belge_no = 'INV-101'. ls_gecici-tarih = '20240101'. ls_gecici-vade_gun = 30.
  APPEND ls_gecici TO lt_faturalar.

  ls_gecici-belge_no = 'INV-102'. ls_gecici-tarih = '20240520'. ls_gecici-vade_gun = 30.
  APPEND ls_gecici TO lt_faturalar.

  ls_gecici-belge_no = 'INV-103'. ls_gecici-tarih = '20231201'. ls_gecici-vade_gun = 60.
  APPEND ls_gecici TO lt_faturalar.

  " --- 2. HESAPLAMA MOTORU ---
  " Field-Symbol kullanarak direkt hafızada işlem yapıyoruz.
  " Böylece MODIFY komutuna gerek kalmıyor ve hata almıyoruz.
  
  LOOP AT lt_faturalar ASSIGNING <ls_fatura>.
    
    " Ödeme Tarihini Bul
    <ls_fatura>-odeme_tar = <ls_fatura>-tarih + <ls_fatura>-vade_gun.

    " Durum Analizi
    IF <ls_fatura>-odeme_tar < lv_bugun.
      " GECİKTİ
      <ls_fatura>-durum   = 'GECİKTİ 🔴'.
      <ls_fatura>-gecikme = lv_bugun - <ls_fatura>-odeme_tar.
    ELSE.
      " NORMAL
      <ls_fatura>-durum   = 'NORMAL 🟢'.
      <ls_fatura>-gecikme = 0.
    ENDIF.

  ENDLOOP.

  " --- 3. RAPORLAMA ---
  cl_demo_output=>display( lt_faturalar ).`,
  },
];
