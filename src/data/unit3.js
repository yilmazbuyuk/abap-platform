export const unit3 = [
  {
    id: "u3-l1",
    tcode: "SE38",
    title: "1. Metin Birleştirme (CONCATENATE)",
    desc: "Metinleri yan yana ekleme, araya boşluk koyma ve modern yöntemler.",
    code: `REPORT z_string_1.

START-OF-SELECTION.
  DATA: lv_ad     TYPE string,
        lv_soyad  TYPE string,
        lv_sonuc  TYPE string,
        lv_unvan  TYPE string.

  lv_ad    = 'Yilmaz'.
  lv_soyad = 'Cevik'.
  lv_unvan = 'Uzman'.

  " 1. KLASİK YÖNTEM (CONCATENATE)
  " Kelimeleri yapıştırır.
  CONCATENATE lv_unvan lv_ad lv_soyad INTO lv_sonuc.
  WRITE: 'Bitisik:', lv_sonuc.

  " 2. AYRAÇ KULLANMA (SEPARATED BY)
  " Kelimeler arasına boşluk veya tire koyar.
  CONCATENATE lv_unvan lv_ad lv_soyad 
         INTO lv_sonuc 
         SEPARATED BY space.
  
  WRITE: /.
  WRITE: 'Boşluklu:', lv_sonuc.

  CONCATENATE lv_unvan lv_ad lv_soyad 
         INTO lv_sonuc 
         SEPARATED BY '-'.

  WRITE: /.
  WRITE: 'Tireli:', lv_sonuc.`,
  },
  {
    id: "u3-l2",
    tcode: "SE38",
    title: "2. Metin Parçalama (SPLIT)",
    desc: "Bir cümleyi belirli bir karakterden bölüp değişkenlere atmak.",
    code: `REPORT z_string_2.

START-OF-SELECTION.
  DATA: lv_cumle  TYPE string,
        lv_isim   TYPE string,
        lv_domain TYPE string.

  " Bir E-Posta adresi düşünelim
  lv_cumle = 'ahmet@sirket.com'.

  WRITE: 'Orijinal:', lv_cumle.

  " 1. ET (@) İŞARETİNDEN BÖLME
  " İlk parça lv_isim'e, kalanı lv_domain'e gider.
  SPLIT lv_cumle AT '@' INTO lv_isim lv_domain.

  WRITE: /.
  WRITE: 'Kullanıcı:', lv_isim.
  WRITE: / 'Domain:   ', lv_domain.

  " 2. BOŞLUKTAN BÖLME
  DATA: lv_ad TYPE string, lv_soyad TYPE string.
  lv_cumle = 'Ali Veli'.
  
  SPLIT lv_cumle AT space INTO lv_ad lv_soyad.
  
  WRITE: /.
  WRITE: |Ad: { lv_ad }, Soyad: { lv_soyad }|.`,
  },
  {
    id: "u3-l3",
    tcode: "SE38",
    title: "3. Karakter Sayma ve Konum (STRLEN & OFFSET)",
    desc: "ABAP'ın en kritik konusu: Metnin uzunluğu ve belirli parçasını alma.",
    code: `REPORT z_string_3.

START-OF-SELECTION.
  DATA: lv_metin   TYPE string,
        lv_uzunluk TYPE i,
        lv_yil     TYPE string,
        lv_ay      TYPE string.

  lv_metin = '20231025'. " Tarih formatı (YYYYAAGG)

  " 1. UZUNLUK BULMA (STRLEN)
  lv_uzunluk = strlen( lv_metin ).
  WRITE: 'Veri:', lv_metin.
  WRITE: / 'Karakter Sayısı:', lv_uzunluk.

  " 2. OFFSET MANTIĞI (Okuma)
  " Bir metnin sadece belirli kısmını almak için +Off(Len) kullanılır.
  " +0(4) -> 0. karakterden başla, 4 tane al.
  
  lv_yil = lv_metin+0(4). " İlk 4 karakter (2023)
  lv_ay  = lv_metin+4(2). " 4. karakterden sonraki 2 karakter (10)

  WRITE: /.
  WRITE: 'Yıl:', lv_yil.
  WRITE: / 'Ay :', lv_ay.

  " 3. DEĞİŞTİRME İŞLEMİ (REPLACE)
  " Offset ile yazma yerine REPLACE kullanmak daha güvenlidir.
  " İlk 4 karakteri (2023) bulup 2025 yapalım.
  
  REPLACE '2023' IN lv_metin WITH '2025'.
  
  WRITE: /.
  WRITE: 'Yeni Tarih:', lv_metin.`,
  },
  {
    id: "u3-l4",
    tcode: "SE38",
    title: "4. Temizleme ve Dönüştürme (CONDENSE & TRANSLATE)",
    desc: "Gereksiz boşlukları silme ve büyük/küçük harf dönüşümü.",
    code: `REPORT z_string_4.

START-OF-SELECTION.
  DATA: lv_kirli TYPE string,
        lv_temiz TYPE string.

  " Başında ve ortasında çok boşluk olan bir metin
  lv_kirli = '   SAP    ABAP    Ogreniyorum   '.

  WRITE: 'Kirli Veri: [', lv_kirli, ']'.

  " 1. CONDENSE (Boşlukları Daralt)
  " Kenardaki boşlukları atar, ortadakileri tek boşluğa indirir.
  lv_temiz = lv_kirli.
  CONDENSE lv_temiz.
  
  WRITE: /.
  WRITE: 'Condense:   [', lv_temiz, ']'.

  " 2. NO-GAPS (Tüm Boşlukları Sil)
  lv_temiz = lv_kirli.
  CONDENSE lv_temiz NO-GAPS.
  
  WRITE: /.
  WRITE: 'No-Gaps:    [', lv_temiz, ']'.

  " 3. BÜYÜK / KÜÇÜK HARF (TRANSLATE)
  TRANSLATE lv_temiz TO UPPER CASE.
  WRITE: /.
  WRITE: 'Büyük Harf: ', lv_temiz.`,
  },
  {
    id: "u3-l5",
    tcode: "SE38",
    title: "5. Bul ve Değiştir (FIND & REPLACE)",
    desc: "Metin içinde arama yapma ve kelime değiştirme.",
    code: `REPORT z_string_5.

START-OF-SELECTION.
  DATA: lv_mesaj TYPE string.

  lv_mesaj = 'Hata oluştu: Kullanıcı bulunamadı.'.

  WRITE: 'Orijinal:', lv_mesaj.

  " 1. ARAMA (SEARCH / FIND)
  " 'Hata' kelimesi var mı?
  FIND 'Hata' IN lv_mesaj.
  
  IF sy-subrc = 0.
    WRITE: /.
    WRITE: 'Sonuç: Metin içinde HATA kelimesi bulundu!'.
  ELSE.
    WRITE: /.
    WRITE: 'Sonuç: Temiz.'.
  ENDIF.

  " 2. DEĞİŞTİRME (REPLACE)
  " 'Hata' kelimesini 'Uyarı' ile değiştirelim.
  REPLACE 'Hata' IN lv_mesaj WITH 'Uyarı'.

  WRITE: /.
  WRITE: 'Yeni Hali:', lv_mesaj.
  
  " Tümünü değiştirme (ALL OCCURRENCES)
  lv_mesaj = 'Kedi, Kedi, Kedi'.
  REPLACE ALL OCCURRENCES OF 'Kedi' IN lv_mesaj WITH 'Köpek'.
  
  WRITE: /.
  WRITE: 'Toplu Değişim:', lv_mesaj.`,
  },
  {
    id: "u3-l6",
    tcode: "SE38",
    title: "6. Matematiksel Fonksiyonlar (ABS, FLOOR, CEIL)",
    desc: "Sayı yuvarlama ve mutlak değer işlemleri.",
    code: `REPORT z_math_1.

START-OF-SELECTION.
  DATA: lv_sayi   TYPE p DECIMALS 2, " Virgüllü sayı
        lv_sonuc  TYPE i.            " Tam sayı

  lv_sayi = '-15.75'.

  WRITE: 'Sayı:', lv_sayi.

  " 1. MUTLAK DEĞER (ABS - Absolute)
  " Eksiyi artı yapar.
  lv_sayi = abs( lv_sayi ).
  WRITE: /.
  WRITE: 'Mutlak (ABS):', lv_sayi.

  " 2. AŞAĞI YUVARLA (FLOOR)
  " 15.75 -> 15 olur.
  lv_sonuc = floor( lv_sayi ).
  WRITE: /.
  WRITE: 'Taban (FLOOR):', lv_sonuc.

  " 3. YUKARI YUVARLA (CEIL)
  " 15.75 -> 16 olur.
  lv_sonuc = ceil( lv_sayi ).
  WRITE: /.
  WRITE: 'Tavan (CEIL):', lv_sonuc.

  " 4. MOD (Kalan bulma)
  " 10'un 3'e bölümünden kalan kaçtır? (1)
  lv_sonuc = 10 MOD 3.
  WRITE: /.
  WRITE: '10 MOD 3:', lv_sonuc.`,
  },
];
