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
    desc: "Veri saklamak için DATA komutu ve temel tipler.",
    code: `REPORT z_ders_2.

START-OF-SELECTION.
  DATA: lv_sayi  TYPE i,
        lv_metin TYPE string.

  lv_sayi = 100.
  lv_metin = 'ABAP Ogreniyorum'.

  WRITE 'Sayı Değeri:'.
  WRITE lv_sayi.
  
  WRITE / 'Metin Değeri:'.
  WRITE lv_metin.`,
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
