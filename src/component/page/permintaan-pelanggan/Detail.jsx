import { useEffect, useRef, useState } from "react";
import { API_LINK, FILE_LINK } from "../../util/Constants";
import { formatDate } from "../../util/Formatting";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Table from "../../part/Table";
import Icon from "../../part/Icon";

const inisialisasiDataProduk = [
  {
    Key: null,
    No: null,
    "Nama Produk/Jasa": null,
    Catatan: null,
    Jumlah: null,
    "Gambar Validasi": null,
    "Persetujuan Engineering": null,
    "Persetujuan PPIC": null,
    Count: 0,
  },
];

export default function PermintaanPelangganDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [dataProduk, setDataProduk] = useState(inisialisasiDataProduk);

  const formDataRef = useRef({
    nomorRegister: "",
    nomorPermintaan: "",
    namaPelanggan: "",
    tanggalPermintaan: "",
    jenisPermintaan: "",
    jenisKomersial: "",
    kontakPelanggan: "",
    noHPPelanggan: "",
    emailPelanggan: "",
    berkasPenawaran: "",
    berkasGambar: "",
    berkasLainnya: "",
    estimasiPenawaran: "",
    keterangan: "",
    statusPermintaan: "",
    alasanBatal: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data1 = await UseFetch(
          API_LINK + "PermintaanPelanggan/DetailPermintaanPelanggan",
          { id: withID }
        );

        if (data1 === "ERROR" || data1.length === 0) {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data permintaan pelanggan."
          );
        } else {
          formDataRef.current = { ...formDataRef.current, ...data1[0] };
        }

        const data2 = await UseFetch(
          API_LINK + "PermintaanPelanggan/DetailPermintaanPelangganProduk",
          { id: withID }
        );

        if (data2 === "ERROR") {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil daftar permintaan produk."
          );
        } else if (data2.length === 0) {
          setDataProduk(inisialisasiDataProduk);
        } else {
          const formattedData = data2.map((value) => ({
            ...value,
            "Gambar Validasi": value["Gambar Validasi"] ? (
              <a
                href={FILE_LINK + value["Gambar Validasi"]}
                className="text-decoration-none fw-bold"
                target="_blank"
              >
                Unduh <Icon name="download" type="Bold" cssClass="ms-1" />
              </a>
            ) : (
              "-"
            ),
            "Persetujuan Engineering": value["Persetujuan Engineering"] ? (
              <>
                {value["Persetujuan Engineering"].split("#")[2] ===
                "[KOSONG]" ? (
                  <>
                    <Icon
                      name="hexagon-check"
                      type="Bold"
                      cssClass="text-success me-2"
                    />
                    Disetujui
                    {value["Persetujuan Engineering"].split("#")[3] !== "-" &&
                      value["Persetujuan Engineering"].split("#")[3] !==
                        "[KOSONG]" && (
                        <>
                          <br />
                          <span
                            className="fst-italic"
                            style={{ fontWeight: "500" }}
                          >
                            "{value["Persetujuan Engineering"].split("#")[3]}"
                          </span>
                        </>
                      )}
                  </>
                ) : (
                  <>
                    <Icon
                      name="times-hexagon"
                      type="Bold"
                      cssClass="text-danger me-2"
                    />
                    Ditolak
                    <br />
                    <span className="fst-italic" style={{ fontWeight: "500" }}>
                      "{value["Persetujuan Engineering"].split("#")[2]}"
                    </span>
                  </>
                )}
                <br />
                {value["Persetujuan Engineering"].split("#")[0]}
                <br />
                {formatDate(value["Persetujuan Engineering"].split("#")[1])}
              </>
            ) : (
              "-"
            ),
            "Persetujuan PPIC": value["Persetujuan PPIC"] ? (
              <>
                {value["Persetujuan PPIC"].split("#")[2] === "[KOSONG]" ? (
                  <>
                    <Icon
                      name="hexagon-check"
                      type="Bold"
                      cssClass="text-success me-2"
                    />
                    Disetujui
                    {value["Persetujuan PPIC"].split("#")[3] !== "-" &&
                      value["Persetujuan PPIC"].split("#")[3] !==
                        "[KOSONG]" && (
                        <>
                          <br />
                          <span
                            className="fst-italic"
                            style={{ fontWeight: "500" }}
                          >
                            "{value["Persetujuan PPIC"].split("#")[3]}"
                          </span>
                        </>
                      )}
                  </>
                ) : (
                  <>
                    <Icon
                      name="times-hexagon"
                      type="Bold"
                      cssClass="text-danger me-2"
                    />
                    Ditolak
                    <br />
                    <span className="fst-italic" style={{ fontWeight: "500" }}>
                      "{value["Persetujuan PPIC"].split("#")[2]}"
                    </span>
                  </>
                )}
                <br />
                {value["Persetujuan PPIC"].split("#")[0]}
                <br />
                {formatDate(value["Persetujuan PPIC"].split("#")[1])}
              </>
            ) : (
              "-"
            ),
            Alignment: [
              "center",
              "left",
              "left",
              "center",
              "center",
              "center",
              "center",
            ],
          }));
          setDataProduk(formattedData);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
          Detail Permintaan Pelanggan
        </div>
        <div className="card-body p-3">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header bg-secondary-subtle fw-bold">
                  Data Permintaan Pelanggan
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-3">
                      <Label
                        forLabel="nomorRegister"
                        title="Nomor Registrasi"
                        data={formDataRef.current.nomorRegister}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="nomorPermintaan"
                        title="Nomor Permintaan"
                        data={formDataRef.current.nomorPermintaan}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="namaPelanggan"
                        title="Nama Pelanggan"
                        data={formDataRef.current.namaPelanggan}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="tanggalPermintaan"
                        title="Tanggal Permintaan"
                        data={formatDate(
                          formDataRef.current.tanggalPermintaan,
                          true
                        )}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="estimasiPenawaran"
                        title="Estimasi Penawaran"
                        data={formatDate(
                          formDataRef.current.estimasiPenawaran,
                          true
                        )}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="jenisPermintaan"
                        title="Jenis Permintaan"
                        data={formDataRef.current.jenisPermintaan}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Label
                        forLabel="keterangan"
                        title="Keterangan/Deskripsi Pekerjaan"
                        data={formDataRef.current.keterangan}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="kontakPelanggan"
                        title="Kontak Pelanggan (PIC)"
                        data={formDataRef.current.kontakPelanggan}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="noHPPelanggan"
                        title="Nomor HP Pelanggan (PIC)"
                        data={formDataRef.current.noHPPelanggan}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="emailPelanggan"
                        title="Email Pelanggan (PIC)"
                        data={formDataRef.current.emailPelanggan}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Label
                        forLabel="statusPermintaan"
                        title="Status"
                        data={
                          formDataRef.current.statusPermintaan === "Batal"
                            ? formDataRef.current.statusPermintaan +
                              "\n\nAlasan: " +
                              formDataRef.current.alasanBatal
                            : formDataRef.current.statusPermintaan
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card mt-3">
                <div className="card-header bg-secondary-subtle fw-bold">
                  Data Berkas Pendukung
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-4">
                      <Label
                        forLabel="berkasPenawaran"
                        title="Berkas Permintaan"
                        data={
                          formDataRef.current.berkasPenawaran.replace(
                            "-",
                            ""
                          ) === "" ? (
                            "-"
                          ) : (
                            <a
                              href={
                                FILE_LINK + formDataRef.current.berkasPenawaran
                              }
                              className="text-decoration-none"
                              target="_blank"
                            >
                              Unduh berkas
                            </a>
                          )
                        }
                      />
                    </div>
                    <div className="col-lg-4">
                      <Label
                        forLabel="berkasGambar"
                        title="Berkas Gambar"
                        data={
                          formDataRef.current.berkasGambar.replace("-", "") ===
                          "" ? (
                            "-"
                          ) : (
                            <a
                              href={
                                FILE_LINK + formDataRef.current.berkasGambar
                              }
                              className="text-decoration-none"
                              target="_blank"
                            >
                              Unduh berkas
                            </a>
                          )
                        }
                      />
                    </div>
                    <div className="col-lg-4">
                      <Label
                        forLabel="berkasLainnya"
                        title="Berkas Lainnya"
                        data={
                          formDataRef.current.berkasLainnya.replace("-", "") ===
                          "" ? (
                            "-"
                          ) : (
                            <a
                              href={
                                FILE_LINK + formDataRef.current.berkasLainnya
                              }
                              className="text-decoration-none"
                              target="_blank"
                            >
                              Unduh berkas
                            </a>
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card mt-3">
                <div className="card-header bg-secondary-subtle fw-bold">
                  Daftar Permintaan Produk/Jasa
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="px-3 py-2 bg-info-subtle border-start border-5 border-info mb-3 fw-bold">
                        Segala diskusi terkait persetujuan atau penolakan
                        terhadap permintaan pelanggan ini dilakukan di luar
                        sistem. Sistem hanya menerima keputusan yang bersifat
                        final.
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <Table data={dataProduk} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="float-end my-4 mx-1">
        <Button
          classType="secondary px-4 py-2"
          label="KEMBALI"
          onClick={() => onChangePage("index")}
        />
      </div>
    </>
  );
}
