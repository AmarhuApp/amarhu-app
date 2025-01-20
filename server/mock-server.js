import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3300;

app.use(bodyParser.json());

// Colección de usuarios simulada
const users = [
    {
        id: "1",
        codigo: "DRO01",
        name: "Lorenzo Vallejo",
        email: "lorenzo.directivo@gmail.com",
        avatar: "/server/images/avatar_directivo.png",
        password: "directivo123",
        role: "DIRECTIVO",
        createdAt: "2024-01-01T12:00:00Z",
        isActive: true
    },
    {
        id: "2",
        codigo: "JP01",
        name: "Samantha Gutierrez",
        email: "sam.jefeprensa@gmail.com",
        avatar: "/server/images/logo-jota.png",
        password: "jefes123",
        role: "JEFE_PRENSA",
        createdAt: "2024-01-02T08:30:00Z",
        isActive: true
    },
    {
        id: "3",
        codigo: "PRO",
        name: "Juan López",
        email: "juan.jefeentrevistas@gmail.com",
        avatar: "/server/images/avatar_jefe_entrevistas.png",
        password: "pro123",
        role: "JEFE_ENTREVISTAS",
        createdAt: "2024-01-03T09:30:00Z",
        isActive: true
    },
    {
        id: "4",
        codigo: "JR01",
        name: "Carlos Rodríguez",
        email: "carlos.jefemenor@gmail.com",
        avatar: "/server/images/avatar_jefe_redaccion.png",
        password: "jrx123",
        role: "JEFE_REDACCION",
        createdAt: "2024-01-04T10:30:00Z",
        isActive: true
    },
    {
        id: "5",
        codigo: "JR02",
        name: "Ana Morales",
        email: "ana.jefemenor@gmail.com",
        avatar: "/server/images/avatar_jefe_redaccion.png",
        password: "jrx456",
        role: "JEFE_REDACCION",
        createdAt: "2024-01-05T11:30:00Z",
        isActive: true
    },
    {
        id: "6",
        codigo: "RA2004",
        name: "Luis Gómez",
        email: "luis.redactor@gmail.com",
        avatar: "/server/images/avatar_redactor.png",
        password: "redactor123",
        role: "REDACTOR",
        createdAt: "2024-01-06T12:30:00Z",
        isActive: true
    },
    {
        id: "7",
        codigo: "L01",
        name: "María López",
        email: "maria.locutora@gmail.com",
        avatar: "/server/images/avatar_locutora.png",
        password: "locutor123",
        role: "LOCUTOR",
        createdAt: "2024-01-07T13:30:00Z",
        isActive: true
    },
    {
        id: "8",
        codigo: "PAN01",
        name: "Carlos Fernández",
        email: "carlos.panelista@gmail.com",
        avatar: "/server/images/avatar_panelista.png",
        password: "panelista123",
        role: "PANELISTA",
        createdAt: "2024-01-08T14:30:00Z",
        isActive: true
    },
    {
        id: "9",
        codigo: "E01",
        name: "Laura Sánchez",
        email: "laura.editor@gmail.com",
        avatar: "/server/images/avatar_editor.png",
        password: "editor123",
        role: "EDITOR",
        createdAt: "2024-01-09T15:30:00Z",
        isActive: true
    }
];

// Endpoint para autenticar
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Busca el usuario por email
    const user = users.find(
        (u) => u.email === email && u.password === password && u.isActive
    );

    if (user) {
        res.status(200).json({
            id: user.id,
            codigo: user.codigo,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            createdAt: user.createdAt,
            isActive: user.isActive,
        });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
    }
});

// Servidor para verificar que está corriendo
app.get('/', (req, res) => {
    res.send('Mock server running...');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`);
});
