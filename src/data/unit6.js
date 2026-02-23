export const unit6 = [
  {
    id: "u6-l1",
    tcode: "SE38",
    title: "1. Sistem Değişkenleri (SY-FIELDS)",
    desc: "ABAP'ın hazır sistem tablosunu (SYST) kullanarak tarih, saat ve kullanıcı gibi dinamik bilgileri okumak.",
    code: `REPORT z_ders_u6_1_system_fields.

START-OF-SELECTION.
* ======================================================================
* SY-FIELDS (SİSTEM ALANLARI) NEDİR?
* ABAP'ta "SY-" ile başlayan değişkenler sistem tarafından otomatik olarak 
* yönetilir. Sizin "DATA" diyerek tanımlamanıza gerek yoktur. Program 
* çalıştığı anda bu alanlar güncel bilgilerle doludur.
* ======================================================================
  

  WRITE: '🖥️ SAP SİSTEM BİLGİSİ GÖSTERGE PANELİ'.
  WRITE: / '--------------------------------------------------'.

  " 1. Kullanıcı Adı (SY-UNAME)
  " O an SAP sistemine login olmuş kişinin kullanıcı adını verir.
  WRITE: / 'Aktif Kullanıcı  :', sy-uname.

  " 2. Bugünün Tarihi (SY-DATUM)
  " Veritabanı formatında (YYYYAAGG) tarih döndürür.
  WRITE: / 'Sistem Tarihi    :', sy-datum.

  " 3. Şu Anki Saat (SY-UZEIT)
  " Uygulama sunucusunun saatini (SSDDSS) formatında döndürür.
  WRITE: / 'Sistem Saati     :', sy-uzeit.

  " 4. İşlem Kodu (SY-TCODE)
  " Şu an hangi işlem kodunun (Transaction) içinde olduğumuzu söyler.
  WRITE: / 'Çalışan T-Code   :', sy-tcode.

  " 5. Dil Anahtarı (SY-LANGU)
  " Sistemin hangi dilde çalıştığını (E, T, D vb.) verir.
  WRITE: / 'Oturum Dili      :', sy-langu.

  WRITE: /.
  WRITE: / '--- DÖNGÜ VE TABLO İNDEKSLERİ ---'.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* SY-INDEX ve SY-TABIX FARKI
* SY-INDEX: DO veya WHILE gibi klasik döngülerin sayacıdır.
* SY-TABIX: LOOP AT (Internal Table) döngülerinin satır sayacıdır.
* ======================================================================

  DO 3 TIMES.
    " DO döngüsünde SY-INDEX kullanılır.
    WRITE: / |DO Döngüsü - Şu anki Tur: { sy-index }|.
  ENDDO.

  WRITE: /.
  WRITE: / '💡 İpucu: SY-SUBRC alanını (İşlem Başarı Durumu) önceki'.
  WRITE: / 'derslerimizde sıkça kullanmıştık. O da bir SY- alanıdır!'.`,
  },
  {
    id: "u6-l2",
    tcode: "SE38",
    title: "2. Tarih Hesaplamaları (Date Math)",
    desc: "Tarih tipi (d) değişkenleri üzerinde toplama-çıkarma yaparak vade bulma ve gün farkı hesaplama.",
    code: `REPORT z_ders_u6_2_date_math.

START-OF-SELECTION.
* ======================================================================
* ABAP'TA TARİH (d) TİPİNİN SIRRI
* Tarih değişkenleri (d), hafızada 8 karakterlik bir metin (YYYYAAGG) 
* gibi tutulsa da, üzerlerinde matematiksel işlem yapılmasına izin verirler.
* Bir tarihe +30 derseniz, ABAP takvime bakar ve 30 gün sonrasını bulur.
* ======================================================================
  DATA: lv_bugun   TYPE d,       " Tarih Tipi (d)
        lv_vade    TYPE d,
        lv_hedef   TYPE d,
        lv_gun_fark TYPE i.      " Fark her zaman tamsayıdır

  lv_bugun = sy-datum. " Sistemin bugünkü tarihini al

  WRITE: '📅 ABAP TARİH HESAPLAMA MOTORU'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / 'Bugünün Tarihi     :', lv_bugun.

* ======================================================================
* 1. GÜN EKLEME VE ÇIKARMA (VADE HESAPLAMA)
* Özellikle lojistik (SD/MM) ve finans (FI) modüllerinde teslimat veya 
* ödeme vadelerini bulmak için kullanılır.
* ======================================================================
  

  " 30 gün sonrası (Ödeme Vadesi)
  lv_vade = lv_bugun + 30.
  WRITE: / '30 Gün Sonra (Vade) :', lv_vade.

  " 1 hafta öncesi (Rapor Başlangıcı)
  lv_vade = lv_bugun - 7.
  WRITE: / '1 Hafta Önce        :', lv_vade.

* ======================================================================
* 2. İKİ TARİH ARASINDAKİ FARK (GÜN SAYISI)
* İki tarihi birbirinden çıkarırsanız, ABAP size aradaki toplam 
* GÜN sayısını tamsayı olarak döndürür.
* ======================================================================
  WRITE: /.
  WRITE: / '--- GÜN FARKI HESAPLAMA ---'.

  " Örnek bir hedef tarih belirleyelim (Gelecek yılın başı)
  lv_hedef = '20270101'. 

  " Tarihleri birbirinden çıkarıyoruz
  lv_gun_fark = lv_hedef - lv_bugun.

  WRITE: / 'Hedef Tarih        :', lv_hedef.
  WRITE: / |Kalan Gün Sayısı   : { lv_gun_fark } gün|.

  " Eğer sonuç negatifse tarih geçmişte kalmış demektir
  IF lv_gun_fark < 0.
    WRITE: / '⚠️ Not: Belirtilen tarih geçmiş bir tarihtir!'.
  ELSE.
    WRITE: / '🚀 Gelecekteki bu tarihe heyecanla bekliyoruz.'.
  ENDIF.

* ======================================================================
* ÖNEMLİ BİLGİ: Ay veya Yıl eklemek için genellikle 
* 'RP_CALC_DATE_PLUS_MONTH_PERIOD' gibi fonksiyonlar kullanılır. 
* Matematiksel toplama (+1) sadece GÜN bazında çalışır.
* ======================================================================`,
  },
  {
    id: "u6-l3",
    tcode: "SE38",
    title: "3. Ayın Son Gününü Bulma (Logic & Offset)",
    desc: "Tarih değişkenlerini parçalayarak ve mantık yürüterek ay sonu tarihini hesaplamak.",
    code: `REPORT z_ders_u6_3_last_day.

START-OF-SELECTION.
* ======================================================================
* AYIN SON GÜNÜNÜ BULMA STRATEJİLERİ
* 1. Hazır Fonksiyon: 'RP_LAST_DAY_OF_MONTHS' fonksiyonunu çağırmak.
* 2. Algoritmik Yol: Ayın 1. gününü bul, üzerine 1 ay ekle, 1 gün çıkar.
* 3. Manuel Yol: Offset kullanarak yılı ve ayı kontrol etmek.
* ======================================================================
  DATA: lv_tarih   TYPE d VALUE '20240215', " Şubat 2024 (Artık Yıl örneği)
        lv_son_gun TYPE d,
        lv_yil     TYPE c LENGTH 4,
        lv_ay      TYPE c LENGTH 2.

  WRITE: '🗓️ ABAP AY SONU HESAPLAMA MANTIĞI'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / 'Seçilen Tarih      :', lv_tarih.

* ======================================================================
* OFFSET İLE TARİHİ PARÇALAMA
* Hatırlatma: Tarih (YYYYAAGG) formatındadır. 
* İlk 4 hane YIL, sonraki 2 hane AY, son 2 hane GÜN'dür.
* ======================================================================
  lv_yil = lv_tarih+0(4). " 2024
  lv_ay  = lv_tarih+4(2). " 02

  WRITE: / |Analiz Edilen Ay   : { lv_ay }.{ lv_yil }|.

* ======================================================================
* ARTIK YIL VE AY KONTROLÜ
* Şubat ayı 4 yılda bir 29 gün çeker. 2024 bir artık yıldır.
* ======================================================================
  

  IF lv_ay = '02'. " Eğer aylardan Şubatsa
    " 2024, 2028 gibi 4'e tam bölünen yıllarda Şubat 29 çeker
    IF lv_yil MOD 4 = 0.
      lv_son_gun = lv_yil && lv_ay && '29'.
    ELSE.
      lv_son_gun = lv_yil && lv_ay && '28'.
    ENDIF.
    
  ELSEIF lv_ay = '04' OR lv_ay = '06' OR lv_ay = '09' OR lv_ay = '11'.
    " 30 çeken aylar (Nisan, Haziran, Eylül, Kasım)
    lv_son_gun = lv_yil && lv_ay && '30'.
    
  ELSE.
    " Diğer tüm aylar 31 çeker
    lv_son_gun = lv_yil && lv_ay && '31'.
  ENDIF.

  WRITE: / '--------------------------------------------------'.
  WRITE: / |Hesaplanan Ay Sonu : { lv_son_gun }|.

* ======================================================================
* PROFESYONEL İPUCU: 
* Gerçek bir projede bu karmaşık kodları yazmak yerine SAP'nin hazır 
* 'LAST_DAY_OF_MONTHS' fonksiyonunu tek satırda çağırırız. Ancak bu 
* manuel mantığı bilmek, algoritma yeteneğinizi geliştirir.
* ======================================================================`,
  },
  {
    id: "u6-l4",
    tcode: "ZAGING",
    title: "4. Proje: Vade (Aging) Raporu",
    desc: "Önceki derslerin birleşimi: Faturaların vade tarihlerini hesaplayan, gecikme günlerini bulan ve ALV formatında raporlayan gerçek bir proje.",
    code: `REPORT z_ders_u6_project_aging.

* ======================================================================
* PROJE KONUSU: FATURA YAŞLANDIRMA (AGING) ANALİZİ
* Senaryo: Elimizde faturalar, bunların kesim tarihleri ve vade günleri var.
* Amacı: Bugünün tarihine göre hangi faturaların vadesi dolmuş, 
* kaç gün gecikmiş ve hangileri hala "Normal" durumda analiz etmek.
* ======================================================================

TYPES: BEGIN OF ty_fatura,
         belge_no   TYPE string,
         tarih      TYPE d,         " Fatura Kesim Tarihi
         vade_gun   TYPE i,         " Ödeme Süresi (30, 60 gün vb.)
         odeme_tar  TYPE d,         " Beklenen Ödeme Tarihi
         durum      TYPE string,    " Gecikti / Normal
         gecikme    TYPE i,         " Gecikme Gün Sayısı
       END OF ty_fatura.

DATA: lt_faturalar TYPE TABLE OF ty_fatura,
      ls_gecici    TYPE ty_fatura,
      lv_bugun     TYPE d.

" Field-Symbol: Tablo üzerinde hızlı ve güvenli işlem yapmak için.
FIELD-SYMBOLS: <ls_fatura> TYPE ty_fatura.

START-OF-SELECTION.
  " Simülasyon Tarihi: 1 Haziran 2024
  lv_bugun = '20240601'. 

  WRITE: '📋 PROJE: FİNANSAL VADE TAKİP RAPORU'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |Rapor Analiz Tarihi: { lv_bugun }|.

* ======================================================================
* 1. VERİ HAZIRLIĞI (MOCK DATA)
* ======================================================================
  " Fatura 1: Ocak'ta kesilmiş, vadesi çoktan dolmuş (Gecikmeli)
  CLEAR ls_gecici.
  ls_gecici-belge_no = 'INV-101'. ls_gecici-tarih = '20240101'. ls_gecici-vade_gun = 30.
  APPEND ls_gecici TO lt_faturalar.

  " Fatura 2: Yeni kesilmiş, vadesine daha var (Normal)
  CLEAR ls_gecici.
  ls_gecici-belge_no = 'INV-102'. ls_gecici-tarih = '20240520'. ls_gecici-vade_gun = 30.
  APPEND ls_gecici TO lt_faturalar.

  " Fatura 3: Geçen seneden kalmış (Çok Gecikmeli)
  CLEAR ls_gecici.
  ls_gecici-belge_no = 'INV-103'. ls_gecici-tarih = '20231201'. ls_gecici-vade_gun = 60.
  APPEND ls_gecici TO lt_faturalar.

* ======================================================================
* 2. HESAPLAMA MOTORU (ENGINE)
* ======================================================================

  
  LOOP AT lt_faturalar ASSIGNING <ls_fatura>.
    
    " Beklenen Ödeme Tarihi = Fatura Tarihi + Vade Süresi
    <ls_fatura>-odeme_tar = <ls_fatura>-tarih + <ls_fatura>-vade_gun.

    " Gecikme Analizi
    IF <ls_fatura>-odeme_tar < lv_bugun.
      " Senaryo A: Vade tarihi geçmiş
      <ls_fatura>-durum   = 'GECİKTİ 🔴'.
      <ls_fatura>-gecikme = lv_bugun - <ls_fatura>-odeme_tar.
    ELSE.
      " Senaryo B: Vadeye henüz gelinmemiş
      <ls_fatura>-durum   = 'NORMAL 🟢'.
      <ls_fatura>-gecikme = 0.
    ENDIF.

  ENDLOOP.

* ======================================================================
* 3. RAPORLAMA KATMANI
* cl_demo_output sayesinde hesaplanan tabloyu şık bir grid olarak basıyoruz.
* ======================================================================
  cl_demo_output=>display( lt_faturalar ).`,
  },
];
