import swaggerAutogen from 'swagger-autogen'




const doc = {
    info: {
        version: "1.0.0",
        title: "VoteDesk Election Management System API",
        description: "Rest API Documentation for VoteDesk Election Management System App"
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server"
        },
        {
            url: "https://backend-pilkades-frhn.vercel.app/api",
            description: "deploy Server from Vercel"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            }
        },
        schemas: {
            RegisterRequest: {
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            },
            LoginRequest: {
                identifier: "Contoh: name / email",
                password: ""
            },
            ForgetPasswordRequest: {
                identifier: "Contoh: name / email"
            },
            VerifyOtpRequest: {
                otp: "123456"
            },
            ResetPasswordRequest: {
                password: "",
                confirmPassword: "",
                resetToken: ""
            },
            ElectionRequest: {
                name: "",
                organizerName: "Contoh: sekolah, pemerintahan, fakultas, organisasi",
                organizerInfo: "Contoh: alamat", 
                startAt: "2026-08-17T08:00:00Z",
                endAt: "2026-08-17T08:00:00Z",
                description: ""
            },
            ElectionStatusRequest: {
                status: "DRAFT"
            },
            ElectionLogoRequest: {
                logo: ".png"
            },
            TpsRequest: {
                name: "TPS 01",
                location: "Jl. sudirman"
            },
            PetugasRequest: {
                name: "",
                email: "",
                password: "",
                tpsId: 123
            },
            CandidateRequest: {
                nomor: 1,
                vision: "",
                mission: "",
                img: ".png",
                members: [
                    {
                        name: "",
                        position: "ketua",
                        order: 1,
                        img: ".png"
                    }
                ]
            },
            VoterRequest: {
                name: "",
                nik: "Contoh: NIK, kelas dll.",
                info: "Contoh: alamat, pangkat dll."
            },
            TokenVoteValidationRequest: {
                token: "123456"
            },
            VoteRequest: {
                token: "123456",
                candidateId: 1
            },
            RemoveMediaSingleRequest: {
                url: "https://res.cloudinary"
            }
        }
    }
}


const outputFile = './swagger-output.json';
const routes = ['../routes/api.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc)
console.log("berhasil mendokumentasikan api");
