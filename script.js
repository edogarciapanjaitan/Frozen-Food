
    let keranjang = [];
    let totalHarga = 0;
    const itemPerHalaman = 15;
    let halamanSekarang = 1;

    // 1. DATA PRODUK
    const semuaProduk = [
        { nama: "Nugget Kanzler (450g)", harga: 45000, img: "kanzler.jpeg" },
        { nama: "GoGo French Fries Shoestring (1kg)", harga: 35000, img: "gogoshoe.jpeg" },
        { nama: "GoGo French Fries 1kg (Crincle Cut)", harga: 37000, img: "gogocrincle.jpeg" },
        { nama: "Ayam Ungkep (8 pcs)", harga: 45000, img: "kentang.jpg" },
        { nama: "Sosis Sapi Kimbo (10 pcs)", harga: 35000, img: "kimbo.jpg" },
        { nama: "Gyoza Prima (250g)", harga: 24000, img: "gyoza.jpg" },
        { nama: "Roti Maryam Coklat (5pcs)", harga: 24000, img: "maryam.jpeg" },
        { nama: "Nugget So Eco (1kg)", harga: 36000, img: "soeco.jpg" },
        { nama: "Bakso Warisan (isi 50)", harga: 35000, img: "bakso.jpeg" },
        { nama: "Chicken Nugget Bellfood Crunchy (500g)", harga: 38000, img: "bf.jpeg" },
        { nama: "Keripik Pisang (500g)", harga: 30000, img: "pisang.jpeg" },
        { nama: "Kerupuk Kulit", harga: 20000, img: "krupuk kulit.jpeg" },
        
        // ... tambahkan produk lainnya di sini
    ];

    // 2. FUNGSI MENAMPILKAN PRODUK
    function tampilkanProduk(halaman) {
        const start = (halaman - 1) * itemPerHalaman;
        const end = start + itemPerHalaman;
        const produkTampil = semuaProduk.slice(start, end);

        const container = document.getElementById('katalog-produk');
        container.innerHTML = ''; // Kosongkan katalog sebelum isi baru

        produkTampil.forEach(produk => {
            // PERBAIKAN: Gunakan 'container.innerHTML', bukan 'katalog.innerHTML'
            container.innerHTML += `
                <div class="produk-card">
                    <img src="${produk.img}" alt="${produk.nama}">
                    <h3>${produk.nama}</h3>
                    <p class="harga">Rp ${produk.harga.toLocaleString()}</p>
                    <button onclick="tambahKeKeranjang('${produk.nama}', ${produk.harga})">Tambah</button>
                </div>
            `;
        });
        buatTombolPagination();
    }

    // 3. FUNGSI PAGINATION
    function buatTombolPagination() {
        const totalHalaman = Math.ceil(semuaProduk.length / itemPerHalaman);
        const kontrol = document.getElementById('pagination-control'); // Pastikan ID sesuai HTML
        kontrol.innerHTML = "";

        for (let i = 1; i <= totalHalaman; i++) {
            kontrol.innerHTML += `
                <button class="${i === halamanSekarang ? 'active' : ''}" 
                        onclick="gantiHalaman(${i})">${i}</button>
            `;
        }
    }

    function gantiHalaman(halaman) {
        halamanSekarang = halaman;
        tampilkanProduk(halaman);
        window.scrollTo(0,0); // Kembali ke atas saat pindah halaman
    }

    // 4. FUNGSI KERANJANG & WHATSAPP
    function tambahKeKeranjang(nama, harga) {
        // Cek apakah produk sudah ada di keranjang
        const itemAda = keranjang.find(item => item.nama === nama);
        if (itemAda) {
            itemAda.qty += 1;
            totalHarga += harga;
        } else {
            keranjang.push({nama, harga, qty: 1});
            totalHarga += harga;
        }
        updateTampilan();
        alert(nama + " berhasil ditambahkan ke keranjang!");
    }

    function ubahQuantity(index, perubahan) {
        const item = keranjang[index];
        const qtyBaru = item.qty + perubahan;
        
        if (qtyBaru <= 0) {
            // Hapus item jika qty = 0
            hapusItem(index);
        } else {
            item.qty = qtyBaru;
            totalHarga += item.harga * perubahan;
            updateTampilan();
        }
    }

    function hapusItem(index) {
        const item = keranjang[index];
        totalHarga -= item.harga * item.qty;
        keranjang.splice(index, 1);
        updateTampilan();
    }

    function updateTampilan() {
        const list = document.getElementById('daftar-pesanan');
        const totalDisplay = document.getElementById('total-harga');
        
        list.innerHTML = '';
        if (keranjang.length === 0) {
            list.innerHTML = '<p style="color: #888;">Belum ada produk yang dipilih.</p>';
        } else {
            keranjang.forEach((item, index) => {
                const subtotal = item.harga * item.qty;
                list.innerHTML += `<div class="item-keranjang">
                    <div class="item-info">
                        <strong>${item.nama}</strong><br>
                        <small>Rp ${item.harga.toLocaleString()} /pcs</small>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="ubahQuantity(${index}, -1)">-</button>
                            <span class="qty-display">${item.qty}</span>
                            <button class="qty-btn" onclick="ubahQuantity(${index}, 1)">+</button>
                        </div>
                        <span style="font-weight:bold; min-width:80px; text-align:right;">
                            Rp ${subtotal.toLocaleString()}
                        </span>
                        <button class="hapus-btn" onclick="hapusItem(${index})">Hapus</button>
                    </div>
                </div>`;
            });
        }
        totalDisplay.innerText = totalHarga.toLocaleString();
    }

    function kirimWA() {
        if (keranjang.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }
        const nomorWA = "6282110798852";
        let pesan = "Halo Admin Bang Ben, saya mau pesan:\n\n";
        keranjang.forEach((item, i) => {
            const subtotal = item.harga * item.qty;
            pesan += `${i+1}. ${item.nama} - ${item.qty}x @ Rp ${item.harga.toLocaleString()}\n   Subtotal: Rp ${subtotal.toLocaleString()}\n`;
        });
        pesan += `\n*Total: Rp ${totalHarga.toLocaleString()}*`;
        
        window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
    }

    // PENTING: Jalankan fungsi ini pertama kali saat halaman dibuka
    tampilkanProduk(halamanSekarang);