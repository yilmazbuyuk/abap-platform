export const unit4 = [
  {
    id: "u4-l1",
    tcode: "SE38",
    title: "1. Alt Programlar (Subroutines - FORM)",
    desc: "Kod tekrarını önlemek için blok yapıları kullanmak.",
    code: `REPORT z_unit4_form.

* Global Değişkenler
DATA: gv_s1    TYPE i,
      gv_s2    TYPE i,
      gv_sonuc TYPE i.

START-OF-SELECTION.
  gv_s1 = 10.
  gv_s2 = 5.

  WRITE: 'İşlem Başlıyor...'.

  " 1. Toplama İşlemi (Alt Program Çağırma)
  PERFORM topla.
  WRITE: / 'Toplama Sonucu:', gv_sonuc.

  " 2. Çıkarma İşlemi
  PERFORM cikar.
  WRITE: / 'Çıkarma Sonucu:', gv_sonuc.

  WRITE: / 'İşlem Bitti.'.

* --- ALT PROGRAMLAR (EN ALTA YAZILIR) ---

FORM topla.
  " Global değişkenleri okur ve değiştirir
  gv_sonuc = gv_s1 + gv_s2.
ENDFORM.

FORM cikar.
  gv_sonuc = gv_s1 - gv_s2.
ENDFORM.`,
  },
  {
    id: "u4-l2",
    tcode: "SE24",
    title: "2. Class ve Method (OOP Temelleri)",
    desc: "İlk yerel sınıfımızı (Local Class) oluşturuyoruz.",
    code: `REPORT z_unit4_class_1.

* --- 1. SINIF TANIMI (DEFINITION) ---
* Burada sınıfın "Neye Benzediğini" anlatırız.
CLASS lcl_insan DEFINITION.
  PUBLIC SECTION.
    " Özellikler (Attributes)
    DATA: ad    TYPE string,
          yas   TYPE i.

    " Yetenekler (Methods)
    METHODS: konus,
             bilgi_ver.
ENDCLASS.

* --- 2. SINIF UYGULAMASI (IMPLEMENTATION) ---
* Burada yeteneklerin "Nasıl Çalıştığını" yazarız.
CLASS lcl_insan IMPLEMENTATION.
  METHOD konus.
    WRITE: / 'Merhaba! Ben konuşabiliyorum.'.
  ENDMETHOD.

  METHOD bilgi_ver.
    WRITE: /.
    WRITE: 'Benim adım', ad.
    WRITE: 've ben', yas, 'yaşındayım.'.
  ENDMETHOD.
ENDCLASS.

* --- 3. ANA PROGRAM ---
START-OF-SELECTION.
  " Bir insan yaratalım (Nesne / Object)
  DATA: lo_insan TYPE REF TO lcl_insan.

  " Hafızada yer aç (Constructor çalışır)
  CREATE OBJECT lo_insan.

  " Özellikleri doldur
  lo_insan->ad  = 'Ahmet'.
  lo_insan->yas = 25.

  " Metotları çağır
  CALL METHOD lo_insan->konus.
  CALL METHOD lo_insan->bilgi_ver.`,
  },
  {
    id: "u4-l3",
    tcode: "SE24",
    title: "3. Parametreli Metotlar (IMPORTING)",
    desc: "Metotlara dışarıdan veri göndermek ve işlem yaptırmak.",
    code: `REPORT z_unit4_class_2.

CLASS lcl_matematik DEFINITION.
  PUBLIC SECTION.
    " IMPORTING: Dışarıdan veri alır
    " RETURNING: Geriye tek bir sonuç döndürür
    METHODS: topla IMPORTING iv_sayi1 TYPE i
                             iv_sayi2 TYPE i
                   RETURNING VALUE(rv_sonuc) TYPE i.
ENDCLASS.

CLASS lcl_matematik IMPLEMENTATION.
  METHOD topla.
    rv_sonuc = iv_sayi1 + iv_sayi2.
    WRITE: / 'Matematik Sınıfı: Toplama yapıldı.'.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: lo_mat  TYPE REF TO lcl_matematik,
        lv_toplam TYPE i.

  CREATE OBJECT lo_mat.

  " Metodu çağırma (Kısa Yazım)
  " RETURNING parametresi direkt sola (=) yazılır.
  lv_toplam = lo_mat->topla( iv_sayi1 = 40 iv_sayi2 = 60 ).

  WRITE: /.
  WRITE: 'Sonuç:', lv_toplam.`,
  },
  {
    id: "u4-l4",
    tcode: "SE24",
    title: "4. Constructor (Kurucu Metot)",
    desc: "Nesne yaratıldığı anda (CREATE OBJECT) çalışan özel metot.",
    code: `REPORT z_unit4_constructor.

CLASS lcl_kedi DEFINITION.
  PUBLIC SECTION.
    DATA: renk TYPE string.

    " CONSTRUCTOR özel bir isimdir.
    " CREATE OBJECT denildiği an otomatik çalışır.
    METHODS: constructor IMPORTING iv_renk TYPE string,
             miyavla.
ENDCLASS.

CLASS lcl_kedi IMPLEMENTATION.
  METHOD constructor.
    " Gelen rengi hafızaya alalım
    renk = iv_renk.
    WRITE: / 'Bir kedi doğdu!'.
  ENDMETHOD.

  METHOD miyavla.
    WRITE: / 'Miyav! Benim rengim:', renk.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: lo_tekir TYPE REF TO lcl_kedi,
        lo_pamuk TYPE REF TO lcl_kedi.

  WRITE '--- 1. Kedi Yaratılıyor ---'.
  " Renk bilgisini yaratırken veriyoruz!
  CREATE OBJECT lo_tekir EXPORTING iv_renk = 'Gri'.
  lo_tekir->miyavla( ).

  WRITE /.
  WRITE '--- 2. Kedi Yaratılıyor ---'.
  CREATE OBJECT lo_pamuk EXPORTING iv_renk = 'Beyaz'.
  lo_pamuk->miyavla( ).`,
  },
  {
    id: "u4-l5",
    tcode: "SE24",
    title: "5. Kalıtım (Inheritance) - İleri Seviye",
    desc: "Bir sınıftan başka sınıf türetmek (Miras Alma).",
    code: `REPORT z_unit4_inheritance.

* --- ATA SINIF (PARENT) ---
CLASS lcl_hayvan DEFINITION.
  PUBLIC SECTION.
    METHODS: nefes_al.
ENDCLASS.

CLASS lcl_hayvan IMPLEMENTATION.
  METHOD nefes_al.
    WRITE: / 'Hayvan nefes alıyor...'.
  ENDMETHOD.
ENDCLASS.

* --- ÇOCUK SINIF (CHILD) ---
* INHERITING FROM: Hayvan sınıfının tüm özelliklerini alır.
CLASS lcl_kus DEFINITION INHERITING FROM lcl_hayvan.
  PUBLIC SECTION.
    METHODS: uc.
ENDCLASS.

CLASS lcl_kus IMPLEMENTATION.
  METHOD uc.
    WRITE: / 'Kuş uçuyor... Kanat çırp! 🦅'.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: lo_marti TYPE REF TO lcl_kus.

  CREATE OBJECT lo_marti.

  WRITE '--- Miras Alınan Özellik ---'.
  " Kuş sınıfında 'nefes_al' yazmadık ama Hayvan'dan miras aldı!
  lo_marti->nefes_al( ).

  WRITE /.
  WRITE '--- Kendi Özelliği ---'.
  lo_marti->uc( ).`,
  },
];
