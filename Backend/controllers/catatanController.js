const { CatatanService } = require('../services/catatanService');

class CatatanController {
    constructor() {
        this.catatanService = new CatatanService();
    }



    createNewCatatan = async (req, res) => {
        console.log("Received data:", req.body);
        try{
            const catatanInfo = req.body;
            console.log(catatanInfo);

            const catatanId = await this.catatanService.addNewCatatan(catatanInfo);

            // console.log(queryInfo)
            res.status(201).json({ catatanId });

        }catch (error) {
            res.status(500).json({ message: error.message });

        }
    }

    viewAllCatatan = async (req, res) => {
        try{
            const idIbu = req.params.idIbu;
            // console.log(id_ibu)

            const catatanIbu = await this.catatanService.getAllCatatanByIdIbu(idIbu);

            res.status(201).json({ data: catatanIbu });


        }catch (error) {
            res.status(500).json({ message: error.message });

        }
    }

    bacaCatatan = async (req, res) => {
        const { id_ibu, tanggal } = req.query;

        if (!id_ibu || !tanggal) {
            return res.status(400).json({ message: "id_ibu dan tanggal wajib diisi" });
        }

        try {
            const catatan = await this.catatanService.getCatatanByTanggal(id_ibu, tanggal);

            if (!catatan) {
                return res.status(404).json({ message: "Catatan tidak ditemukan" });
            }

            return res.status(200).json({ message: "Berhasil mengambil catatan", data: catatan });
        } catch (error) {
            return res.status(500).json({ message: "Terjadi kesalahan saat mengambil catatan", error: error.message });
        }
    };


    catatanSummary = async (req, res) => {
        const id_ibu = req.params.idIbu;

        if (!id_ibu) {
            return res.status(400).json({ message: "id_ibu wajib diisi" });
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const pad = (n) => n.toString().padStart(2, '0');
        const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const sevenDaysAgoStr = formatDate(sevenDaysAgo);

        try {
            const catatan = await this.catatanService.getSummaryCatatan(id_ibu, sevenDaysAgoStr);

            if (!catatan) {
                return res.status(404).json({ message: "Catatan tidak ditemukan" });
            }

            return res.status(200).json({ message: "Berhasil mengambil catatan", data: catatan });
        } catch (error) {
            return res.status(500).json({ message: "Terjadi kesalahan saat mengambil catatan", error: error.message });
        }
    }
}

module.exports = { CatatanController }