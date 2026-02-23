export const unit1 = [
  {
    id: "u1-l1",
    tcode: "SE38",
    title: "1. Merhaba Dünya (WRITE)",
    desc: "ABAP programlamaya ilk adım: Ekrana çıktı vermek.",
    code: `REPORT z_ders_1.

START-OF-SELECTION.
  WRITE 'Merhaba SAP Dünyası!'.
  WRITE / 'Bu benim ilk raporum.'.
  WRITE / 'Hazırlayan: Yılmaz Büyük'.
  WRITE / 'https://www.linkedin.com/in/yilmazbuyuk/'.`,
  },
  {
    id: "u1-l2",
    tcode: "SE38",
    title: "2. Değişkenler ve Tipler",
    desc: "ABAP'ta veri saklamak için DATA komutu ve temel veri tipleri (Char, Integer, Date, Time, Packed vb.).",
    code: `REPORT z_ders_2_tipler.

START-OF-SELECTION.
* ======================================================================
* 1. TEMEL VERİ TİPLERİ (DATA TYPES)
* ABAP'ta değişken tanımlamak için "DATA:" komutu kullanılır.
* Zincirleme (chain) tanım yapmak için iki nokta (:) koyarız.
* ======================================================================

  DATA: 
    lv_tam_sayi   TYPE i,                   " Integer: Tam Sayı
    lv_ondalikli  TYPE p DECIMALS 2,        " Packed: Ondalıklı Sayı (Para, Miktar vb.)
    lv_metin      TYPE string,              " String: Uzunluğu dinamik olarak değişen metin
    lv_karakter   TYPE c LENGTH 10,         " Char: Sabit uzunluklu metin (10 karakter)
    lv_sayisal_c  TYPE n LENGTH 5,          " Numc: Sadece rakam içeren metin (Başına sıfır ekler)
    lv_tarih      TYPE d,                   " Date: Tarih (YYYYMMDD formatında tutulur)
    lv_saat       TYPE t.                   " Time: Saat (HHMMSS formatında tutulur)

* ======================================================================
* 2. DEĞİŞKENLERE DEĞER ATAMA (ASSIGNMENT)
* Eşittir (=) operatörü ile değişkenlerin içini doldururuz.
* Metinler her zaman tek tırnak (') içinde yazılır.
* ======================================================================
  
  lv_tam_sayi   = 42.
  lv_ondalikli  = '150.75'.                 " Ondalıklı atamalar güvenli olması için tırnakla yapılabilir.
  lv_metin      = 'ABAP Platformuna Hos Geldiniz!'.
  lv_karakter   = 'SAP ABAP'.               " 10 karaktere tamamlamak için sonuna boşluk ekler.
  lv_sayisal_c  = 123.                      " 5 haneli olduğu için veritabanında '00123' olarak tutulur.
  
  " Tarih ve saat için ABAP'ın hazır sistem değişkenlerini (SY) kullanabiliriz.
  lv_tarih      = sy-datum.                 " sy-datum: Sistemin bugünkü tarihi
  lv_saat       = sy-uzeit.                 " sy-uzeit: Sistemin o anki saati

* ======================================================================
* 3. EKRANA YAZDIRMA (OUTPUT)
* İpucu: Yeni bir satıra geçmek için "/" işareti kullanılır.
* ======================================================================

  WRITE: '🚀 ABAP VERİ TİPLERİ REHBERİ'.
  WRITE: /. " Boş satır bırakır
  
  WRITE: / '--- SAYISAL TİPLER ---'.
  WRITE: / 'Tam Sayı (i)        :', lv_tam_sayi.
  WRITE: / 'Ondalıklı Sayı (p)  :', lv_ondalikli.
  
  WRITE: /. 
  
  WRITE: / '--- METİNSEL TİPLER ---'.
  WRITE: / 'Dinamik Metin (string):', lv_metin.
  WRITE: / 'Sabit Metin (c)       :', lv_karakter.
  WRITE: / 'Sayısal Metin (n)     :', lv_sayisal_c.
  
  WRITE: /.
  
  WRITE: / '--- ZAMAN TİPLERİ (SİSTEM DEĞİŞKENLERİ) ---'.
  WRITE: / 'Sistem Tarihi (d)   :', lv_tarih.
  WRITE: / 'Sistem Saati (t)    :', lv_saat.`,
  },
  {
    id: "u1-l3",
    tcode: "SE38",
    title: "3. Matematik İşlemleri",
    desc: "ABAP'ta temel aritmetik (+, -, *, /) ve ileri düzey matematiksel (DIV, MOD, **) operatörleri.",
    code: `REPORT z_ders_3_matematik.

START-OF-SELECTION.
* ======================================================================
* 1. DEĞİŞKEN TANIMLAMA VE BAŞLANGIÇ DEĞERİ (VALUE)
* Değişken tanımlarken "VALUE" komutu ile onlara anında değer atayabiliriz.
* ======================================================================
  DATA: 
    lv_s1        TYPE i VALUE 15,    " 1. Sayımız: 15
    lv_s2        TYPE i VALUE 4,     " 2. Sayımız: 4
    lv_sonuc     TYPE i,             " Tam sayı sonuçları için
    lv_ondalikli TYPE p DECIMALS 2.  " Küsuratlı sonuçlar için (Para/Oran)

  WRITE: '🧮 ABAP MATEMATİKSEL İŞLEMLER REHBERİ'.
  WRITE: /.
  WRITE: / |İşlem Yapılacak Sayılar: { lv_s1 } ve { lv_s2 }|.
  WRITE: '--------------------------------------------------'.

* ======================================================================
* 2. TEMEL ARİTMETİK İŞLEMLER (+, -, *, /)
* ======================================================================

  " Toplama
  lv_sonuc = lv_s1 + lv_s2.
  WRITE: / 'Toplama İşlemi (+):', lv_sonuc.

  " Çıkarma
  lv_sonuc = lv_s1 - lv_s2.
  WRITE: / 'Çıkarma İşlemi (-):', lv_sonuc.

  " Çarpma
  lv_sonuc = lv_s1 * lv_s2.
  WRITE: / 'Çarpma İşlemi  (*):', lv_sonuc.

  " Bölme (Ondalıklı veri tipi kullanarak kesin sonuç alma)
  lv_ondalikli = lv_s1 / lv_s2.
  WRITE: / 'Bölme İşlemi   (/):', lv_ondalikli.

  WRITE: /.
  WRITE: / '--- İLERİ DÜZEY ABAP OPERATÖRLERİ ---'.

* ======================================================================
* 3. İLERİ DÜZEY İŞLEMLER (DIV, MOD, **)
* Özellikle döngülerde ve mantıksal kontrollerde çok sık kullanılır.
* ======================================================================

  " DIV: Tam Sayı Bölmesi (Bölümdeki küsuratı atar, sadece tam sayıyı alır)
  " Örnek: 15'in içinde 4 kaç kere var? (Cevap: 3)
  lv_sonuc = lv_s1 DIV lv_s2.
  WRITE: / 'Tam Sayı Bölme (DIV):', lv_sonuc.

  " MOD: Kalan Bulma (Modülüs) 
  " Örnek: 15'i 4'e böldüğümüzde kalan kaçtır? (15 = 4*3 + 3 -> Kalan: 3)
  " Genellikle bir sayının tek/çift olduğunu bulmak için (MOD 2) kullanılır.
  lv_sonuc = lv_s1 MOD lv_s2.
  WRITE: / 'Kalan Bulma    (MOD):', lv_sonuc.

  " ** : Üs Alma (Kuvvetini Alma)
  " Örnek: 15 üzeri 4 (15^4)
  lv_sonuc = lv_s1 ** lv_s2.
  WRITE: / 'Üs Alma        (**):', lv_sonuc.`,
  },
  {
    id: "u1-l4",
    tcode: "SE38",
    title: "4. Mantıksal Kararlar (IF/ELSE)",
    desc: "Program akışını yönlendirmek için IF, ELSEIF, ELSE yapıları ve AND/OR/IS INITIAL mantıksal operatörleri.",
    code: `REPORT z_ders_4_if_else.

START-OF-SELECTION.
* ======================================================================
* 1. TEMEL IF - ELSEIF - ELSE YAPISI
* Karşılaştırma operatörleri: = (EQ), <> (NE), > (GT), < (LT), >= (GE), <= (LE)
* ======================================================================
  DATA: lv_not TYPE i VALUE 75.

  WRITE: '⚖️ ABAP MANTIKSAL KARARLAR (IF/ELSE)'.
  WRITE: /.
  WRITE: |Öğrenci Notu: { lv_not }|.

  " ELSEIF ile birden fazla koşulu arka arkaya kontrol edebiliriz.
  IF lv_not >= 90.
    WRITE: / 'Harf Notu: AA (Mükemmel) 🌟'.
  ELSEIF lv_not >= 70.
    WRITE: / 'Harf Notu: BB (İyi) 👍'.
  ELSEIF lv_not >= 50.
    WRITE: / 'Harf Notu: CC (Geçti) ✅'.
  ELSE.
    WRITE: / 'Harf Notu: FF (Kaldı) ❌'.
  ENDIF.

* ======================================================================
* 2. ÇOKLU KOŞULLAR (AND / OR)
* AND (Ve): Tüm koşullar doğru olmalıdır.
* OR (Veya): Koşullardan en az biri doğru olmalıdır.
* ======================================================================
  DATA: lv_devamsizlik TYPE i VALUE 5,
        lv_disiplin_ceza TYPE c LENGTH 1 VALUE ' '. " Boş karakter

  WRITE: /.
  WRITE: / '--- MEZUNİYET KONTROLÜ (AND / OR) ---'.

  " Hem notu 50'den büyük/eşit olmalı VE devamsızlığı 10'dan küçük olmalı
  IF lv_not >= 50 AND lv_devamsizlik < 10.
    WRITE: / 'Durum: Sınıfı Geçmeye Hak Kazandı! 🎉'.
  ELSE.
    WRITE: / 'Durum: Sınıf Tekrarı! ⚠️'.
  ENDIF.

  " Disiplin cezası varsa 'X' (Dolu), yoksa ' ' (Boş) diyelim.
  " Notu 90 üstü olsa bile cezası varsa VEYA devamsızlığı 20'den büyükse sınıfta kalsın.
  IF lv_not < 50 OR lv_disiplin_ceza = 'X' OR lv_devamsizlik > 20.
    WRITE: / 'Uyarı: Öğrenci başarısız veya kuralları ihlal etti.'.
  ENDIF.

* ======================================================================
* 3. ABAP'A ÖZEL: BOŞLUK KONTROLÜ (IS INITIAL / IS NOT INITIAL)
* Bir değişkene henüz değer atanmamışsa "INITIAL" durumundadır.
* Sayılar için INITIAL = 0, Metinler için INITIAL = '' (Boşluk) demektir.
* ======================================================================
  DATA: lv_isim TYPE string. " Henüz bir değer atamadık!

  WRITE: /.
  WRITE: / '--- BOŞLUK KONTROLÜ (IS INITIAL) ---'.

  " Eğer lv_isim boşsa...
  IF lv_isim IS INITIAL.
    WRITE: / 'HATA: Öğrenci ismi sisteme girilmemiş!'.
  ELSE.
    WRITE: / |Öğrenci Adı: { lv_isim }|.
  ENDIF.
  
  " Eğer boş DEĞİLSE... (IS NOT INITIAL)
  " lv_isim = 'Ahmet'. " (Bu satırın başındaki yorumu kaldırıp sonucu test edebilirsiniz)
  IF lv_isim IS NOT INITIAL.
    WRITE: / 'Sistemde kayıtlı bir öğrenci bulundu.'.
  ENDIF.`,
  },
  {
    id: "u1-l5",
    tcode: "SE38",
    title: "5. Döngüler (DO/WHILE)",
    desc: "Tekrarlayan işlemleri yönetmek için DO, WHILE döngüleri ve döngü kontrolleri (EXIT, CONTINUE).",
    code: `REPORT z_ders_5_donguler.

START-OF-SELECTION.
* ======================================================================
* 1. DO ... TIMES DÖNGÜSÜ (Sabit Tekrarlı Döngü)
* Bir işlemi tam olarak belirttiğiniz sayı kadar tekrar eder.
* ABAP'ta döngünün kaçıncı turda olduğunu tutan otomatik bir sistem
* değişkeni vardır: "sy-index". Ekstra bir sayaç tanımlamaya gerek yoktur!
* ======================================================================

  WRITE: '🔄 ABAP DÖNGÜLER REHBERİ (DO / WHILE)'.
  WRITE: /.
  WRITE: / '--- 1. DO DÖNGÜSÜ (5 Tekrar) ---'.

  DO 5 TIMES.
    WRITE: / |Tur Sayısı: { sy-index }|.
  ENDDO.

* ======================================================================
* 2. WHILE DÖNGÜSÜ (Koşula Bağlı Döngü)
* Belirli bir koşul doğru (TRUE) olduğu sürece dönmeye devam eder.
* Dikkat: Sonsuz döngüye girmemek için içeride koşulu değiştirmeliyiz.
* ======================================================================
  DATA: lv_stok TYPE i VALUE 20.

  WRITE: /.
  WRITE: / '--- 2. WHILE DÖNGÜSÜ (Stok Tüketimi) ---'.

  " Stok 0'dan büyük olduğu SÜRECE dön:
  WHILE lv_stok > 0.
    " Her turda stoğu 5'er 5'er azaltalım (Satış simülasyonu)
    lv_stok = lv_stok - 5.
    WRITE: / |Depodan ürün satıldı. Kalan Stok: { lv_stok }|.
  ENDWHILE.

* ======================================================================
* 3. DÖNGÜ KONTROLLERİ (CONTINUE ve EXIT)
* Döngülere yön vermek için hayati öneme sahip iki komut vardır.
* CONTINUE: O turu (iterasyonu) es geçer ve bir sonraki turdan devam eder.
* EXIT    : Döngüyü tamamen kırar ve dışarı çıkar.
* ======================================================================

  WRITE: /.
  WRITE: / '--- 3. CONTINUE (Atla) ve EXIT (Çık) ---'.

  " 10 kez dönecek bir döngü başlatalım
  DO 10 TIMES.
  
    " Eğer tur sayısı 3 ise, bu turu ATLA (Ekrana 3 yazmaz, 4'e geçer)
    IF sy-index = 3.
      WRITE: / |Tur { sy-index }: CONTINUE çalıştı, bu tur atlandı!|.
      CONTINUE. 
    ENDIF.

    " Eğer tur sayısı 6 ise, döngüyü tamamen KIR (7, 8, 9, 10 hiç çalışmaz)
    IF sy-index = 6.
      WRITE: / |Tur { sy-index }: EXIT çalıştı, döngü sonlandırıldı!|.
      EXIT.
    ENDIF.

    " Yukarıdaki IF'lere takılmayan turlar buraya ulaşır
    WRITE: / |Normal Tur: { sy-index }|.
    
  ENDDO.

  WRITE: /.
  WRITE: / '✅ Program başarıyla tamamlandı.'.`,
  },
];
