export const unit10 = [
  {
    id: "u10-l1",
    tcode: "Z_DEBUG_LOG",
    title: "1. Debugging Mantığı (Loglama)",
    desc: "Kod akarken değişkenlerin değerini anlık takip etmek.",
    code: `REPORT z_unit10_debug.

DATA: lv_sayac TYPE i,
      lv_toplam TYPE i.

START-OF-SELECTION.
  lv_sayac = 0.
  lv_toplam = 0.

  WRITE: '--- Döngü Başlıyor ---'.

  " Senaryo: Toplama işlemi yapıyoruz ama sonuç yanlış çıkıyor diyelim.
  " Hatayı bulmak için her adımda değişkenleri ekrana basacağız (Loglama).

  DO 5 TIMES.
    lv_sayac = lv_sayac + 1.
    
    " HATA SİMÜLASYONU: Sayaç 3 olduğunda yanlışlıkla 10 ekleyelim
    IF lv_sayac = 3.
       lv_toplam = lv_toplam + 10. 
    ELSE.
       lv_toplam = lv_toplam + lv_sayac.
    ENDIF.

    " --- DEBUG LOG ---
    " Gerçek sistemde buraya Breakpoint konur.
    " Biz burada değerleri yazdırarak iz sürüyoruz.
    WRITE: / |🛑 DEBUG: Tur={ sy-index }, Sayaç={ lv_sayac }, Toplam={ lv_toplam }|.
    
  ENDDO.

  WRITE: /.
  WRITE: '--- Döngü Bitti ---'.
  WRITE: / |🏁 FİNAL SONUÇ: { lv_toplam }|.
  WRITE: / '(Beklenen sonuç 1+2+3+4+5 = 15 idi. Loglara bakarak hatayı bul!)'.`,
  },
  {
    id: "u10-l2",
    tcode: "Z_SUBRC",
    title: "2. Hata Kodu Analizi (SY-SUBRC)",
    desc: "ABAP'ın en önemli değişkeni: İşlem başarılı mı, başarısız mı?",
    code: `REPORT z_unit10_subrc.

TYPES: BEGIN OF ty_malzeme,
         matnr TYPE string,
         maktx TYPE string,
       END OF ty_malzeme.

DATA: lt_malzeme TYPE TABLE OF ty_malzeme,
      ls_malzeme TYPE ty_malzeme.

START-OF-SELECTION.
  " Mock Data
  ls_malzeme-matnr = '100'. ls_malzeme-maktx = 'Demir'. APPEND ls_malzeme TO lt_malzeme.
  ls_malzeme-matnr = '200'. ls_malzeme-maktx = 'Bakır'. APPEND ls_malzeme TO lt_malzeme.

  " 1. BAŞARILI OKUMA (SUBRC = 0)
  READ TABLE lt_malzeme INTO ls_malzeme WITH KEY matnr = '100'.
  
  WRITE: |Okuma 1 (Kod 100) -> SY-SUBRC: { sy-subrc }|.
  
  IF sy-subrc = 0.
    WRITE: ' (✅ Başarılı)'.
  ELSE.
    WRITE: ' (❌ Başarısız)'.
  ENDIF.

  WRITE: /.

  " 2. BAŞARISIZ OKUMA (SUBRC = 4 veya 8)
  READ TABLE lt_malzeme INTO ls_malzeme WITH KEY matnr = '999'.
  
  WRITE: |Okuma 2 (Kod 999) -> SY-SUBRC: { sy-subrc }|.
  
  IF sy-subrc <> 0.
    WRITE: ' (⚠️ Kayıt Bulunamadı - Kod 4)'.
  ENDIF.

  " NEDEN ÖNEMLİ?
  " Eğer subrc kontrolü yapmazsan, eski veriyi işlemeye devam edersin!
  " Örneğin burada ls_malzeme içinde hala 'Demir' var.
  WRITE: /.
  WRITE: |Dikkat: Son okuma hatalıydı ama değişken değeri: { ls_malzeme-maktx }|.
  WRITE: '(Bu yüzden her READ işleminden sonra IF sy-subrc = 0 kontrolü ŞARTTIR!)'.`,
  },
  {
    id: "u10-l3",
    tcode: "Z_MESSAGES",
    title: "3. Mesaj Tipleri (MESSAGE)",
    desc: "Kullanıcıya Error (E), Success (S) ve Info (I) mesajı vermek.",
    code: `REPORT z_unit10_messages.

PARAMETERS: p_not TYPE i.

START-OF-SELECTION.
  " Simülasyonda MESSAGE komutu çalışmaz (Pop-up açmaz).
  " Ancak biz bunu simüle edeceğiz.
  
  WRITE: |Girilen Not: { p_not }|.
  WRITE: /.

  IF p_not < 0 OR p_not > 100.
    " TYPE 'E' (Error): Programı durdurur, kırmızı mesaj verir.
    WRITE: '🛑 MESSAGE TYPE E: Geçersiz not girişi! (İşlem Durduruldu)'.
    EXIT. " Programdan çık
  ENDIF.

  IF p_not < 50.
    " TYPE 'I' (Info): Bilgi verir, işlem devam eder.
    WRITE: 'ℹ️ MESSAGE TYPE I: Dersten kaldınız ama bütünlemeye girebilirsiniz.'.
  ELSE.
    " TYPE 'S' (Success): Yeşil mesaj verir, işlem başarılı.
    WRITE: '✅ MESSAGE TYPE S: Tebrikler, geçtiniz!'.
  ENDIF.

  WRITE: /.
  WRITE: 'Program sonuna ulaşıldı (Eğer hata olsaydı burayı göremezdin).'.`,
  },
  {
    id: "u10-l4",
    tcode: "Z_BUG_FIX",
    title: "4. Proje: Bozuk Raporu Tamir Et",
    desc: "Bu kod hatalı çalışıyor! Logları inceleyerek hatayı bul.",
    code: `REPORT z_unit10_bugfix.

* --- SENARYO ---
* Bir mağaza, müşterilerine puan veriyor.
* Her 100 TL alışverişe 10 Puan.
* Ancak kodda bir hata var, puanlar yanlış hesaplanıyor.

TYPES: BEGIN OF ty_musteri,
         id    TYPE i,
         ad    TYPE string,
         tutar TYPE i,
         puan  TYPE i,
       END OF ty_musteri.

DATA: lt_musteri TYPE TABLE OF ty_musteri,
      ls_musteri TYPE ty_musteri.

FIELD-SYMBOLS: <fs_mus> TYPE ty_musteri.

START-OF-SELECTION.
  " 1. Veri Hazırlığı
  ls_musteri-id = 1. ls_musteri-ad = 'Ali'.   ls_musteri-tutar = 500. APPEND ls_musteri TO lt_musteri.
  ls_musteri-id = 2. ls_musteri-ad = 'Veli'.  ls_musteri-tutar = 200. APPEND ls_musteri TO lt_musteri.
  ls_musteri-id = 3. ls_musteri-ad = 'Ayşe'.  ls_musteri-tutar = 1000. APPEND ls_musteri TO lt_musteri.

  WRITE: '--- HESAPLAMA BAŞLIYOR ---'.

  " 2. Hatalı Döngü
  LOOP AT lt_musteri ASSIGNING <fs_mus>.
    
    " BEKLENEN: Tutar / 10 (Örn: 500 TL -> 50 Puan)
    " HATALI KOD: Aşağıdaki satırda mantık hatası var.
    
    <fs_mus>-puan = <fs_mus>-tutar / 10 + 100. " <-- HATA BURADA! (Fazladan 100 ekliyor)

    " Log koyarak hatayı görelim
    WRITE: / |DEBUG: Müşteri={ <fs_mus>-ad }, Tutar={ <fs_mus>-tutar }, Hesaplanan Puan={ <fs_mus>-puan }|.
    
  ENDLOOP.

  WRITE: /.
  WRITE: '--- SONUÇ TABLOSU ---'.
  
  " 500 TL için 50 Puan olması gerekirken 150 yazıyor.
  " Kullanıcı bu loglara bakıp hatayı tespit etmeli.
  cl_demo_output=>display( lt_musteri ).`,
  },
];
