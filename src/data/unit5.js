export const unit5 = [
  {
    id: "u5-l1",
    tcode: "SE38",
    title: "1. Veri Temizleme (SORT & DELETE)",
    desc: "Tablodaki tekrar eden (mükerrer/kopya) kayıtları silerek benzersiz (Unique) bir liste elde etmek.",
    code: `REPORT z_ders_u5_1_clean_table.

* ======================================================================
* 1. TYPES VE DATA TANIMLAMALARI
* ======================================================================
  TYPES: BEGIN OF ty_liste,
           ulke  TYPE string,
           sehir TYPE string,
         END OF ty_liste.

  DATA: lt_yerler TYPE TABLE OF ty_liste,
        ls_yer    TYPE ty_liste.

START-OF-SELECTION.
* ======================================================================
* 2. TABLOYU KARIŞIK VE KOPYA VERİLERLE DOLDURMA
* Gerçek hayatta veritabanından veri çektiğimizde genellikle böyle 
* dağınık ve tekrar eden (mükerrer) kayıtlar gelir.
* ======================================================================
  
  CLEAR ls_yer. ls_yer-ulke = 'TR'. ls_yer-sehir = 'İstanbul'. APPEND ls_yer TO lt_yerler.
  CLEAR ls_yer. ls_yer-ulke = 'DE'. ls_yer-sehir = 'Berlin'.   APPEND ls_yer TO lt_yerler.
  CLEAR ls_yer. ls_yer-ulke = 'TR'. ls_yer-sehir = 'İstanbul'. APPEND ls_yer TO lt_yerler. " Kopya!
  CLEAR ls_yer. ls_yer-ulke = 'TR'. ls_yer-sehir = 'Ankara'.   APPEND ls_yer TO lt_yerler.
  CLEAR ls_yer. ls_yer-ulke = 'DE'. ls_yer-sehir = 'Berlin'.   APPEND ls_yer TO lt_yerler. " Kopya!

  WRITE: '🧹 ABAP TABLO TEMİZLİĞİ (DUPLICATE SİLME)'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / '--- 1. TEMİZLİK ÖNCESİ (KARIŞIK LİSTE) ---'.
  
  LOOP AT lt_yerler INTO ls_yer.
    WRITE: / |Ülke: { ls_yer-ulke } - Şehir: { ls_yer-sehir }|.
  ENDLOOP.

* ======================================================================
* 3. TEMİZLİK İŞLEMİ (ALTIN KURAL: ÖNCE SORT!)
* DELETE ADJACENT DUPLICATES komutu Türkçeye "YANYANA DURAN kopyaları sil" 
* olarak çevrilir. Eğer aynı olan iki kayıt alt alta (yan yana) durmuyorsa 
* sistem onları kopya olarak algılamaz ve silmez!
* Bu yüzden silme işleminden önce tabloyu kesinlikle SORT etmeliyiz.
* ======================================================================
 
  WRITE: /.
  WRITE: / '--------------------------------------------------'.
  WRITE: / '--- 2. TEMİZLİK SONRASI (BENZERSİZ LİSTE) ---'.

  " Adım 1: Önce tabloyu Ülke ve Şehir kolonlarına göre A'dan Z'ye sırala.
  " Böylece aynı olan kayıtlar alt alta (Adjacent) gelmiş olur.
  SORT lt_yerler BY ulke sehir.

  " Adım 2: Şimdi yan yana gelmiş olan kopyalardan sadece birini bırak, 
  " diğerlerini sil! (COMPARING ile hangi kolonların benzersiz olacağını seçiyoruz)
  DELETE ADJACENT DUPLICATES FROM lt_yerler COMPARING ulke sehir.

  " Sonucu Ekrana Basalım
  LOOP AT lt_yerler INTO ls_yer.
    WRITE: / |Ülke: { ls_yer-ulke } - Şehir: { ls_yer-sehir }|.
  ENDLOOP.`,
  },
  {
    id: "u5-l2",
    tcode: "SE38",
    title: "2. Algoritmik Özetleme (READ & MODIFY)",
    desc: "Karmaşık hesaplamalar için manuel toplama mantığı: Veri özet tablosunda varsa üzerine ekle (MODIFY), yoksa yeni satır aç (APPEND).",
    code: `REPORT z_ders_u5_2_algo_ozet.

* ======================================================================
* 1. NEDEN MANUEL ALGORİTMA?
* Bazen tablolarımızdaki verileri (Örn: Bölge bazlı satış toplamları)
* özetlememiz gerekir. ABAP'ta bunun için COLLECT adında kısa bir komut 
* olsa da, mantığı kavramak ve daha karmaşık mühendislik hesaplamaları 
* yapabilmek için READ TABLE ve MODIFY kullanarak kendi özetleme 
* algoritmamızı kurmalıyız.
* ======================================================================
  TYPES: BEGIN OF ty_satis,
           bolge TYPE string,
           tutar TYPE i,
         END OF ty_satis.

  DATA: lt_ham_veri TYPE TABLE OF ty_satis, " Veritabanından gelen dağınık veri
        lt_ozet     TYPE TABLE OF ty_satis, " Bizim oluşturacağımız özet tablo
        ls_veri     TYPE ty_satis,
        ls_ozet     TYPE ty_satis.

START-OF-SELECTION.
* ======================================================================
* 2. HAM VERİ HAZIRLIĞI
* Dikkat: Ege bölgesinden 3 farklı kayıt var (100 + 200 + 50 = 350 yapmalı)
* ======================================================================
  CLEAR ls_veri. ls_veri-bolge = 'Ege'.     ls_veri-tutar = 100. APPEND ls_veri TO lt_ham_veri.
  CLEAR ls_veri. ls_veri-bolge = 'Marmara'. ls_veri-tutar = 500. APPEND ls_veri TO lt_ham_veri.
  CLEAR ls_veri. ls_veri-bolge = 'Ege'.     ls_veri-tutar = 200. APPEND ls_veri TO lt_ham_veri.
  CLEAR ls_veri. ls_veri-bolge = 'Ege'.     ls_veri-tutar = 50.  APPEND ls_veri TO lt_ham_veri.

  WRITE: '📊 ABAP ALGORİTMİK ÖZETLEME (KONTROLLÜ TOPLAMA)'.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* 3. MANUEL ÖZETLEME (KONSOLİDASYON) ALGORİTMASI
* Mantık: Ham veriyi satır satır dön. Özet tablosuna bak; eğer o bölge 
* daha önce eklendiyse (Bulunduysa) tutarın ÜZERİNE EKLE (MODIFY). 
* Eğer yoksa (İlk defa görüyorsan) YENİ SATIR olarak ekle (APPEND).
* ======================================================================
  
  LOOP AT lt_ham_veri INTO ls_veri.
    
    " Altın Kural: READ TABLE yapmadan önce hedef Work Area'yı temizle!
    CLEAR ls_ozet.
    
    " 1. Adım: Bu bölgeyi özet listemize daha önce yazdık mı?
    READ TABLE lt_ozet INTO ls_ozet WITH KEY bolge = ls_veri-bolge.

    IF sy-subrc = 0.
      " SENARYO A: Zaten var! (Daha önce eklemişiz)
      " Eski tutarın üzerine yeni gelen tutarı ekliyoruz (Örn: 100 + 200)
      ls_ozet-tutar = ls_ozet-tutar + ls_veri-tutar.
      
      " Değişikliği özet tablosundaki AYNI SIRAYA (sy-tabix) geri koyuyoruz.
      MODIFY lt_ozet FROM ls_ozet INDEX sy-tabix.
    
    ELSE.
      " SENARYO B: İlk defa geldi! (Özet tablosunda bu bölge yok)
      " Sıfırdan bir kayıt oluşturup özet tablosunun en altına ekliyoruz.
      ls_ozet-bolge = ls_veri-bolge.
      ls_ozet-tutar = ls_veri-tutar.
      
      APPEND ls_ozet TO lt_ozet.
    ENDIF.

  ENDLOOP.

* ======================================================================
* 4. SONUÇ TABLOSUNU EKRANA BASMA
* ======================================================================
  WRITE: / '✅ Hesaplama Tamamlandı. Sonuç Tablosu:'.
  WRITE: / '--------------------------------------------------'.
  
  LOOP AT lt_ozet INTO ls_ozet.
    WRITE: / |Bölge: { ls_ozet-bolge } | Toplam Satış: { ls_ozet-tutar } TL|.
  ENDLOOP.`,
  },
  {
    id: "u5-l3",
    tcode: "SE38",
    title: "3. Performans Yönetimi (FIELD-SYMBOLS)",
    desc: "ABAP'ın Pointer yapısı. Veriyi kopyalamadan, bellekteki (RAM) adresinde doğrudan değiştirmek.",
    code: `REPORT z_ders_u5_3_field_symbols.

* ======================================================================
* 1. FIELD-SYMBOL NEDİR?
* Normalde LOOP AT ... INTO ls_yapı dediğimizde, sistem tablodaki satırı 
* kopyalayıp Work Area'ya yapıştırır. Bu büyük tablolarda vakit kaybıdır.
*
* FIELD-SYMBOLS ise kopyalama yapmaz; tablodaki satıra bir "ayna" tutar 
* veya bir "kablo" uzatır. Siz Field-Symbol'ü değiştirdiğiniz an, 
* tablo otomatik olarak değişir. MODIFY komutuna gerek kalmaz!
* ======================================================================
  TYPES: BEGIN OF ty_urun,
           ad    TYPE string,
           fiyat TYPE i,
         END OF ty_urun.

  DATA: lt_urunler TYPE TABLE OF ty_urun,
        ls_urun    TYPE ty_urun.

  " Field Symbol Tanımı: Mutlaka küçüktür-büyüktür (< >) içinde yazılır.
  FIELD-SYMBOLS: <fs_urun> TYPE ty_urun.

START-OF-SELECTION.
  " Veri Hazırlığı
  CLEAR ls_urun. ls_urun-ad = 'Laptop'. ls_urun-fiyat = 10000. APPEND ls_urun TO lt_urunler.
  CLEAR ls_urun. ls_urun-ad = 'Mouse'.  ls_urun-fiyat = 500.   APPEND ls_urun TO lt_urunler.

  WRITE: '🚀 ABAP PERFORMANS: FIELD-SYMBOLS'.
  WRITE: / '--------------------------------------------------'.

* ======================================================================
* 2. YENİ NESİL GÜNCELLEME (HIZLI YÖNTEM)
* "INTO" yerine "ASSIGNING" kullanıyoruz. Bu şu demek:
* "Her satırı kopyalayıp getirme, <fs_urun> sembolünü o satıra bağla!"
* ======================================================================
  
  
  LOOP AT lt_urunler ASSIGNING <fs_urun>.
    
    " Senaryo: Ürünlere %10 Zam Yapalım.
    " DİKKAT: Burada <fs_urun> doğrudan tablonun içindeki o satıra bakıyor.
    " Bu satırı değiştirdiğimizde tablodaki veri de ANINDA değişir.
    
    <fs_urun>-fiyat = <fs_urun>-fiyat * 110 / 100.
    
    " MÜTHİŞ BİLGİ: Normalde kullandığımız 'MODIFY lt_urunler FROM ...' 
    " komutuna burada ihtiyacımız YOK! Çünkü biz kopyayı değil, asıl veriyi güncelledik.
    
  ENDLOOP.

* ======================================================================
* 3. SONUCU KONTROL ETME
* ======================================================================
  WRITE: / '✅ Zamlı Fiyatlar (Hafıza Üzerinden Güncellendi):'.
  WRITE: / '--------------------------------------------------'.
  
  LOOP AT lt_urunler INTO ls_urun.
    WRITE: / |Ürün: { ls_urun-ad WIDTH = 10 } | Yeni Fiyat: { ls_urun-fiyat } TL|.
  ENDLOOP.

  WRITE: /.
  WRITE: / 'ℹ️ Not: Büyük verilerde FIELD-SYMBOLS kullanımı %20-%40 arası hız kazandırır.'.`,
  },
  {
    id: "u5-l4",
    tcode: "SE38",
    title: "4. Hata Yönetimi (TRY-CATCH)",
    desc: "Programın beklenmedik durumlarda çökmesini (Dump/ST22) engellemek ve hataları zarifçe yönetmek.",
    code: `REPORT z_ders_u5_4_try_catch.

START-OF-SELECTION.
* ======================================================================
* 1. HATA YÖNETİMİ (EXCEPTION HANDLING) NEDİR?
* Yazdığımız kodlar bazen mantıklı olsa da çalışma anında (Runtime) 
* beklenmedik hatalar verebilir. Örneğin; bir sayıyı 0'a bölmek, 
* olmayan bir dosyayı açmaya çalışmak veya yanlış formatta bir veri okumak.
* Bu durumlarda SAP sistemi programı tamamen durdurur (Dump). 
* TRY-CATCH, bu çöküşü engelleyip kullanıcıya düzgün bir mesaj vermemizi sağlar.
* ======================================================================
  DATA: lv_sayi1 TYPE i VALUE 100,
        lv_sayi2 TYPE i VALUE 0,   " Tehlike! Sıfıra bölme hatası.
        lv_sonuc TYPE p DECIMALS 2.

  WRITE: '🛠️ ABAP HATA YÖNETİMİ (TRY-CATCH) REHBERİ'.
  WRITE: / '--------------------------------------------------'.
  WRITE: / |İşlem: { lv_sayi1 } / { lv_sayi2 } denemesi yapılıyor...|.

* ======================================================================
* 2. TRY-CATCH BLOĞU
* TRY   : "Hata çıkma ihtimali olan riskli bölge"
* CATCH : "Eğer hata çıkarsa ne yapayım?"
* ENDTRY: "Hata yönetimini bitir, normal akışa devam et."
* ======================================================================
 
  
  TRY.
      " Riskli kod buraya yazılır.
      lv_sonuc = lv_sayi1 / lv_sayi2.
      WRITE: / |İşlem Başarılı! Sonuç: { lv_sonuc }|.

    CATCH cx_sy_zerodivide.
      " Özel Hata Yakalama: Sadece 'Sıfıra Bölme' hatası gelirse burası çalışır.
      WRITE: / '🛑 HATA: Bir sayıyı sıfıra (0) bölemezsiniz!'.
      WRITE: / '⚠️ Program çökmeden (Dump almadan) bu hata yakalandı.'.

    CATCH cx_root.
      " Genel Hata Yakalama: Yukarıdakiler dışındaki tüm hatalar buraya düşer.
      WRITE: / '🛑 HATA: Beklenmedik bir sistem hatası oluştu.'.

  ENDTRY.

* ======================================================================
* 3. PROGRAMIN DEVAMLILIĞI
* Eğer TRY-CATCH kullanmasaydık, program yukarıdaki bölme satırında 
* patlayacak ve aşağıdaki mesaj asla yazılmayacaktı.
* ======================================================================
  WRITE: /.
  WRITE: / '--------------------------------------------------'.
  WRITE: / '✅ Program akışı güvenli bir şekilde son noktaya ulaştı.'.
  WRITE: / 'Burası çalışıyorsa, sistem hayatta kalmış demektir!'.`,
  },
];
