import { FastifyRequest, FastifyReply } from "fastify";
import { initORM } from "../utils/db";
import { z, ZodError } from "zod";
import { EntityExistsError, EntityNotFound } from "../utils/erros";
import { QueryParams } from "../types/query-params";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

const informasiSchema = z.object({
    judul: z.string().min(1).max(255),
    isi: z.string().min(1).max(255),
});

export async function getInformasi(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const { filter, value } = request.query;

    try {
        const informasi = await db.informasi.fetch(filter, value);
        return reply.status(200).send(informasi);
    } catch (error) {
        console.error("Error fetching informasi:", error);
        return reply.status(500);
    }
}

export async function getInformasiById(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const { id } = request.params as any;

    try {
        const informasi = await db.informasi.findOne(id);
        if (!informasi) {
            return reply.status(404).send({ message: "informasi record not found" });
        }

        return reply.status(200).send(informasi);
    } catch (error) {
        console.error("Error fetching informasi:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function getInformasiPage(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const { idInformasi } = request.params as { idInformasi: string };
    console.log(idInformasi);

    try {
        const informasi = await db.informasi.fetch("idInformasi", idInformasi);

        if (!informasi || informasi.length === 0) {
            return reply.status(404).send("Informasi not found");
        }
        const item = informasi[0];
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">

        <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>PuskeSmart</title>

        <!-- My Main CSS -->
        <link rel="stylesheet" href="../css/myCSS/main.css">

        <!-- My CSS -->
        <link rel="stylesheet" href="../css/myCSS/detail.css">

        <!-- Custom fonts for this template -->
        <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">

        <!-- Custom styles for this template -->
        <link href="../css/sb-admin-2.min.css" rel="stylesheet">

        <!-- Custom styles for this page -->
        <link href="../vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">

        <!-- My font -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Inter:wght@400;500;600&family=Julius+Sans+One&family=Open+Sans:wght@400;500;600;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet">

        </head>

        <body id="" style="font-family: 'Poppins', serif; padding-top: 100px">

        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light shadow fixed-top" style="background-color: #68A3F3;">
            <div class="container-lg p-3">
            <!-- Logo -->
            <div>
                <img src="../img/asset/logo.png" alt="Logo" class="" style="width: auto; height: 40px;">
            </div>

            <!-- Toggler for mobile view -->
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"
                style="border: 1px solid aliceblue;">
                <span class="" style="color: aliceblue;"><i class="fa-solid fa-bars"></i></span>
            </button>

            <!-- Navbar links centered with mx-auto -->
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav mx-auto">
                <a class="nav-tengah linknya" href="/home" style="font-size: 20px;">Beranda</a>
                <a class="nav-tengah linknya" href="/pendaftaran" style="font-size: 20px;">Pendaftaran</a>
                <a class="nav-tengah linknya active" href="/informasi" style="font-size: 20px;">Informasi</a>
                <a class="nav-tengah linknya" href="/ulasan" style="font-size: 20px;">Ulasan</a>
                </div>

                <!-- Masuk button aligned to the right -->
                <a class="tombol nav-link btn btn-primary font-weight-bold shadow" href="/akun"
                style="color: aliceblue; font-size: 1.2rem;">Akun</a>
            </div>
            </div>
        </nav>
        <!-- End Navbar -->

        <!-- Main  -->
        <div class="container-lg">
            <div class="d-flex justify-content-center mt-3">
            <img
                src="${item.foto}"
                alt="" class="img-fluid responsive-img">
            </div>
            <div>
            <h1 style="font-weight: bold; color: black;">${item.judul}.</h1>
            <h5 style="margin-bottom: 10px; font-weight: 600; color: black;">
            ${new Date(item.created).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
            </h5>
            ${formatIsiContent(item.isi)}

            <a href="/informasi" class="btn btn-primary mb-5">← Kembali</a>
            </div>
        </div>
        <!-- End Main -->

        <!-- Footer -->
        <footer class="footer pt-10 pb-5 mt-auto footer-light" style="background-color: #68A3F3;">
            <div class="container-lg">
            <div class="row gx-5 py-5">
                <div class="col-lg-6">
                <div class="footer-brand mb-2"><img src="../img/asset/logoVer.png" alt="" style="width: auto; height: 40px;">
                </div>
                <!-- Almat -->
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-location-dot" style="font-size: 15px; color: white;"></i>
                    <p class="ml-3 my-2" style="font-size: 12px; color: white; margin-left: 10px;">
                    Jl. Yunus Sanis No.9, Handil Jaya, <br>Kec. Jelutung, Kota Jambi, Jambi, 36125
                    </p>
                </div>
                <!-- no telp -->
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-phone-volume" style="font-size: 15px; color: white;"></i>
                    <p class="ml-3 my-2" style="font-size: 12px; color: white; margin-left: 10px;">
                    (021) 123-4567
                    </p>
                </div>
                <!-- Email -->
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-envelope" style="font-size: 15px; color: white;"></i>
                    <p class="ml-3 my-2" style="font-size: 12px; color: white; margin-left: 10px;">
                    info@puskesmaskebunhandil.co.id
                    </p>
                </div>
                </div>
                <div class="col-lg-6">
                <div class="row gx-2">
                    <div class="col-md-4 mb-5 mb-lg-0">
                    <div class="text-uppercase-expanded text-lg mb-4" style="color: white; font-weight: bold;">
                        Layanan</div>
                    <ul class="list-unstyled text-light" style="font-weight: 600;">
                        <li class="" style="margin-bottom: -10px;">
                        <p>Poli Umum
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>Poli Anak
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>Poli Gigi
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>Poli Bidan
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>Laboratorium
                        </li>

                    </ul>
                    </div>
                    <div class="col-md-4 mb-5 mb-md-0">
                    <div class="text-uppercase-expanded text-lg mb-4" style="color: white; font-weight: bold;">
                        Dukungan</div>
                    <ul class="list-unstyled text-light" style="font-weight: 600;">
                        <li class="" style="margin-bottom: -10px;">
                        <p>Pusat Bantuan
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>FAQ
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>Kontak Kami
                        </li>
                    </ul>
                    </div>
                    <div class="col-md-4">
                    <div class="text-uppercase-expanded text-lg mb-4" style="color: white; font-weight: bold;">
                        Tentang Kami
                    </div>
                    <ul class="list-unstyled text-light" style="font-weight: 600;">
                        <li class="" style="margin-bottom: -10px;">
                        <p>Visi Misi
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>Tim Kami
                        </li>
                        <li class="" style="margin-bottom: -10px;">
                        <p>Bantuan & Artikel
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
            <hr class="my-5" style="background-color: white;">
            <div class="row gx-5 align-items-center">
                <div class="col-md-6 small" style="color: white;">Copyright © PuskeSmart, 2024 - Hak Cipta Dilindungi.
                </div>
                <div class="col-md-6 text-right small">
                <a href="#!" style="color: white; text-decoration: none;">Privacy Policy</a> · <a href="#!"
                    style="color: white; text-decoration: none;">Terms &amp; Conditions</a>
                </div>
            </div>
            </div>
        </footer>
        <!-- End Footer -->

        <!-- Main JS -->
        <script src="../js/myJS/main.js"></script>
        <!-- The JS -->
        <script src="../js/myJS/detail.js"></script>
        <!-- Font Awesome -->
        <script src="https://kit.fontawesome.com/3659f450a4.js" crossorigin="anonymous"></script>
        <!-- Bootstrap core JavaScript-->
        <script src="../vendor/jquery/jquery.min.js"></script>
        <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

        <!-- Core plugin JavaScript-->
        <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>

        <!-- Custom scripts for all pages-->
        <script src="../js/sb-admin-2.min.js"></script>

        </body>

        </html>
        `;
        reply.header("Content-Type", "text/html; charset=utf-8");
        return reply.status(200).send(htmlContent);
    } catch (error) {
        console.error("Error fetching informasis:", error);
        return reply.status(500);
    }
}

export async function getInformasiPageAdmin(
    request: FastifyRequest<{ Querystring: QueryParams }>,
    reply: FastifyReply,
) {
    const db = await initORM();
    const { idInformasi } = request.params as { idInformasi: string };
    console.log(idInformasi);

    try {
        const informasi = await db.informasi.fetch("idInformasi", idInformasi);

        if (!informasi || informasi.length === 0) {
            return reply.status(404).send("Informasi not found");
        }
        const item = informasi[0];
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">

        <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="../img/asset/logo.png" type="image/x-icon">
        <title>PuskeSmart</title>

        <!-- My Main CSS -->
        <link rel="stylesheet" href="../css/myCSS/main-admin.css">

        <!-- My CSS -->
        <link rel="stylesheet" href="../css/myCSS/detail-informasi-admin.css">

        <!-- Custom fonts for this template-->
        <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">

        <!-- Custom styles for this template-->
        <link href="../css/sb-admin-2.min.css" rel="stylesheet">

        <!-- My font -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Inter:wght@400;500;600&family=Julius+Sans+One&family=Open+Sans:wght@400;500;600;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet" />

        </head>

        <body id="page-top" style="font-family: 'Poppins', sans-serif;">

        <!-- Page Wrapper -->
        <div id="wrapper">

            <!-- Sidebar -->
            <ul class="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar" style="background-color: #97C0F7;">

            <!-- Sidebar - Brand -->
            <div class="sidebar-brand d-flex align-items-center justify-content-center">
                <img src="../img/asset/logoVer.png" alt="PuskeSmart" id="logo" class="">
                <img src="../img/asset/logo.png" alt="PuskeSmart" id="logo2" width="40px" class="d-none">
            </div>

            <!-- Divider -->
            <hr class="sidebar-divider my-0 shadow" style="border: 1px solid white; border-radius: 10px;">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item active">
                <a class="nav-link" href="dashboard.html">
                <i class="fa-solid fa-house"></i>
                <span>Dashboard</span></a>
            </li>

            <!-- Nav Item - Pendaftaran -->
            <li class="nav-item">
                <a class="nav-link" href="/pendaftaran-admin" style="font-weight: 600;">
                <i class="fa-solid fa-file-invoice"></i>
                <span>Pendaftaran</span></a>
            </li>

            <!-- Nav Item - Informasi -->
            <li class="nav-item">
                <a class="nav-link" href="/informasi-admin" style="font-weight: 600;">
                <i class="fa-solid fa-circle-info"></i>
                <span>Informasi</span></a>
            </li>

            <!-- Nav Item - Ulasan -->
            <li class="nav-item">
                <a class="nav-link" href="/ulasan-admin" style="font-weight: 600;">
                <i class="fa-solid fa-comments"></i>
                <span>Ulasan</span></a>
            </li>

            <!-- Sidebar Toggler (Sidebar) -->
            <div class="text-center d-none d-md-inline mt-3">
                <button class="rounded-circle border-0" id="sidebarToggle"></button>
            </div>
            </ul>
            <!-- End of Sidebar -->

            <!-- Content Wrapper -->
            <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <!-- Sidebar Toggle (Topbar) -->
                <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>

                <!-- Title -->
                <div class="d-flex align-items-center mt-2">
                    <h1 style="font-size: 1.5rem; font-weight: 600; color: black;">
                    Informasi
                    </h1>
                </div>

                <!-- Topbar Navbar -->
                <ul class="navbar-nav ml-auto">
                    <!-- Nav Item - User Information -->
                    <li class="nav-item dropdown no-arrow">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <span class="mr-2 d-none d-lg-inline text-gray-600 small" id="admin-name"></span>
                        <img class="img-profile rounded-circle" src="../img/undraw_profile_2.svg">
                    </a>
                    <!-- Dropdown - User Information -->
                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <a class="dropdown-item" href="#">
                        <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                        </a>
                    </div>
                    </li>
                </ul>
                </nav>


                <!-- Begin Page Content -->
                <div class="container-fluid d-flex justify-content-center">
                <div style="width: 900px;">
                    <div class="d-flex justify-content-center mt-3">
                    <img
                        src="/uploads/informasi/${item.foto}"
                        alt="" class="img-fluid responsive-img" height="200" width="auto">
                    </div>
                    <div>
                    <h1 style="font-weight: bold; color: black;">${item.judul}</h1>
                    <h5 style="margin-bottom: 10px; font-weight: 600; color: black;">${new Date(item.created).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</h5>
                    <p style="color: black;">${formatIsiContent(item.isi)}</p>

                    <a href="/informasi-admin" class="btn btn-primary mb-5">← Kembali</a>
                    </div>
                </div>

                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer class="sticky-footer bg-secondary">
                <div class="container my-auto">
                <div class="copyright text-center my-auto">
                    <span style="color: white;">Copyright &copy; PuskeSmart, 2024 - Hak Cipta Dilindungi.</span>
                </div>
                </div>
            </footer>
            <!-- End of Footer -->
            </div>
            <!-- End of Content Wrapper -->

        </div>
        <!-- End of Page Wrapper -->

        <!-- Scroll to Top Button-->
        <a class="scroll-to-top rounded" href="#page-top">
            <i class="fas fa-angle-up"></i>
        </a>

        <!-- Logout Modal-->
        <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                </div>
                <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                <a class="btn btn-primary" href="login.html">Logout</a>
                </div>
            </div>
            </div>
        </div>

        <!-- SweetAlert2 -->
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <!-- My Main JS -->
        <script src="../js/myJS/main-admin.js"></script>
        <!-- My JS -->
        <script src="../js/myJS/detail-informasi-admin.js"></script>
        <!-- Font Awesome -->
        <script src="https://kit.fontawesome.com/3659f450a4.js" crossorigin="anonymous"></script>
        <!-- Bootstrap core JavaScript-->
        <script src="../vendor/jquery/jquery.min.js"></script>
        <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

        <!-- Core plugin JavaScript-->
        <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>

        <!-- Custom scripts for all pages-->
        <script src="../js/sb-admin-2.min.js"></script>

        <!-- Page level plugins -->
        <script src="../vendor/chart.js/Chart.min.js"></script>

        <!-- Page level custom scripts -->
        <script src="../js/demo/chart-area-demo.js"></script>
        <script src="../js/demo/chart-pie-demo.js"></script>

        </body>

        </html>
        `;
        reply.header("Content-Type", "text/html; charset=utf-8");
        return reply.status(200).send(htmlContent);
    } catch (error) {
        console.error("Error fetching informasis:", error);
        return reply.status(500);
    }
}

function formatIsiContent(content: string) {
    const words = content.split(" ");
    const paragraphs: any = [];
    let paragraph: any = [];

    words.forEach((word, index) => {
        paragraph.push(word);
        // If the paragraph has 100 words, push it as a new paragraph
        if (paragraph.length >= 100 || index === words.length - 1) {
            paragraphs.push(paragraph.join(" "));
            paragraph = [];
        }
    });

    return paragraphs.map((p: any) => `<p style="color: black;">${p}</p>`).join("\n");
}

export async function createInformasi(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();

    try {
        const parts = request.parts();
        const payload: any = {};
        let filePath: string | null = null;
        let fileName: string | null = null;

        for await (const part of parts) {
            if (part.type === "file") {
                const uploadDir = path.join(__dirname, "../uploads/informasi");
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
                if (!allowedImageTypes.includes(part.mimetype) && part.filename.trim() !== "") {
                    return reply.status(400).send({ message: "File harus berupa image" });
                }

                if (part.filename.trim() === "") {
                    fileName = "default.png"; // Default image if no file is uploaded
                } else {
                    fileName = `${Date.now()}-${part.filename}`;
                    filePath = path.join(uploadDir, fileName);

                    await pipeline(part.file, fs.createWriteStream(filePath));
                }
            } else {
                // Collect other fields
                payload[part.fieldname] = part.value;
            }
        }

        informasiSchema.parse(payload);
        const { judul, isi } = payload;

        await db.informasi.save(fileName, judul, isi);

        return reply.status(201).send({ message: `Informasi ${judul} successfully created` });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);
            return reply.status(400).send({ message: "Validation failed", errors: errorMessages });
        }
        if (error instanceof EntityExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error && (error as any).code === "FST_REQ_FILE_TOO_LARGE") {
            return reply.status(413).send({ message: "File is too large" });
        }
        console.error("Error creating informasi:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function updateInformasi(request: FastifyRequest<{ Params: { idInformasi: any } }>, reply: FastifyReply) {
    const db = await initORM();
    const { idInformasi } = request.params;

    try {
        const parts = request.parts();
        const payload: any = {};
        let filePath: string | null = null;
        let fileName: string | null = null;

        // Retrieve the current file name if available
        const informasiData = await db.informasi.findOne({ idInformasi });
        let oldFileName: string | null = null;
        if (informasiData && informasiData.foto) {
            oldFileName = informasiData.foto;
        }

        for await (const part of parts) {
            if (part.type === "file") {
                const uploadDir = path.join(__dirname, "../uploads/informasi");
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
                if (!allowedImageTypes.includes(part.mimetype) && part.filename.trim() !== "") {
                    return reply.status(400).send({ message: "File harus berupa image" });
                }

                if (part.filename.trim() === "") {
                    fileName = oldFileName || "default.png"; // Use the old file if no file is uploaded
                } else {
                    fileName = `${Date.now()}-${part.filename}`;
                    filePath = path.join(uploadDir, fileName);

                    await pipeline(part.file, fs.createWriteStream(filePath));
                }

                // Delete the old file if it's different from the new one
                if (oldFileName && oldFileName !== fileName && oldFileName !== "default.png") {
                    const oldFilePath = path.join(uploadDir, oldFileName);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
            } else {
                // Collect other fields
                payload[part.fieldname] = part.value;
            }
        }

        informasiSchema.parse(payload);
        const { judul, isi } = payload;

        // Update the record in the database with the new file name
        await db.informasi.update(idInformasi, fileName, judul, isi);

        return reply.status(201).send({ message: `Informasi ${judul} successfully updated` });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);
            return reply.status(400).send({ message: "Validation failed", errors: errorMessages });
        }
        if (error instanceof EntityExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error && (error as any).code === "FST_REQ_FILE_TOO_LARGE") {
            return reply.status(413).send({ message: "File is too large" });
        }
        console.error("Error updating informasi:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function deleteInformasiById(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const { idInformasi } = request.params as any;

    if (isNaN(idInformasi)) {
        return reply.status(400).send({ message: `Informasi ${idInformasi} must be a number` });
    }

    try {
        const informasi = await db.informasi.findOne(idInformasi);
        if (!informasi) {
            return reply.status(404).send({ message: "informasi record not found" });
        }
        await db.informasi.remove(informasi);
        return reply.status(201).send({ message: `Informasi ${idInformasi} successfully deleted` });
    } catch (error) {
        if (error instanceof EntityNotFound) {
            return reply.status(404).send({ message: error.message });
        }
        return reply.status(500);
    }
}
