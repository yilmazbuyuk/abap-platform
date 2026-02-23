export const unit1 = [
  {
    id: "u1-l1",
    tcode: "SE38",
    title: "1. Merhaba Dünya (WRITE)",
    desc: "ABAP programlamaya ilk adım: Ekrana çıktı vermek.",
    code: `REPORT z_ders_1.

START-OF-SELECTION.
  WRITE 'Merhaba SAP Dünyası!'.
  WRITE / 'Bu benim ilk raporum.'.`,
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
    desc: "Toplama, çıkarma, çarpma ve bölme işlemleri.",
    code: `REPORT z_ders_3.

START-OF-SELECTION.
  DATA: lv_sonuc TYPE i,
        lv_s1    TYPE i VALUE 10,
        lv_s2    TYPE i VALUE 5.

  " Toplama
  lv_sonuc = lv_s1 + lv_s2.
  WRITE / 'Toplama (10+5):'.
  WRITE lv_sonuc.

  " Çarpma
  lv_sonuc = lv_s1 * lv_s2.
  WRITE / 'Çarpma (10*5):'.
  WRITE lv_sonuc.

  " Bölme
  lv_sonuc = lv_s1 / lv_s2.
  WRITE / 'Bölme (10/5):'.
  WRITE lv_sonuc.`,
  },
  {
    id: "u1-l4",
    tcode: "SE38",
    title: "4. Mantıksal Kararlar (IF/ELSE)",
    desc: "Koşullara göre programın akışını değiştirmek.",
    code: `REPORT z_ders_4.

START-OF-SELECTION.
  DATA: lv_not TYPE i VALUE 45.

  WRITE 'Öğrenci Notu:'.
  WRITE lv_not.
  WRITE /.

  " Not 50'den büyük veya eşitse
  IF lv_not >= 50.
    WRITE 'Durum: GEÇTİ ✅'.
  ELSE.
    WRITE 'Durum: KALDI ❌'.
  ENDIF.`,
  },
  {
    id: "u1-l5",
    tcode: "SE38",
    title: "5. Döngüler (DO/WHILE)",
    desc: "Bir işlemi belirli sayıda tekrar etmek.",
    code: `REPORT z_ders_5.

START-OF-SELECTION.
  DATA: lv_sayac TYPE i.

  WRITE 'Döngü Başlıyor...'.

  " 5 Kere dönen döngü
  DO 5 TIMES.
    lv_sayac = lv_sayac + 1.
    WRITE / 'Tur:'.
    WRITE lv_sayac.
  ENDDO.

  WRITE / 'Döngü Bitti.'.`,
  },
];
