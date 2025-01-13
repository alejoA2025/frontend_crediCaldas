
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import  CrearClientes from "views/clientes/crearClientes.js";
import ListaClientes from "views/clientes/listaClientes.js";
import ListaCobrar from "views/clientes/listaCobrar.js"
import PagarCuota from "views/cuota/pagarCuota.js"
import CrearCredito from "views/credito/crearCredito.js"
import DetalleCredito from "views/credito/detalleCredito.js"
import CrearCapital from "views/capital/capital.js";
import CrearGastos from "views/gastos/crearGastos.js";
import ListaGastos from "views/gastos/listaGastos.js";
import EditarCliente from "views/clientes/editarCliente.js";
import CuotaCliente from "views/cuota/cuotaCliente.js";
import ListaCapital from "views/capital/listaCapital.js";
var routes = [
  


  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-circle-08 text-yellow",
  //   component: <Profile />,
  //   layout: "/admin",
  // },
  {
    path: "/lista-clientes",
    name: "Lista Clientes",
    icon: "ni ni-bullet-list-67 text-red",
    component: <ListaClientes />,
    layout: "/admin",
  },
  {
    path: "/lista-cobrar",
    name: "Lista Pago",
    icon: "ni ni-bullet-list-67 text-red",
    component: <ListaCobrar />,
    layout: "/admin",
  },
  {
    path: "/lista-gastos",
    name: "Lista gastos",
    icon: "ni ni-bullet-list-67 text-red",
    component: <ListaGastos />,
    layout: "/admin",
  },
  {
    path: "/abonar-cuota/:id",
    name: "Abonar Pago",
    icon: "ni ni-bullet-list-67 text-red",
    component: <PagarCuota />,
    sidebar: false,
    layout: "/admin",
  },

  {
    path: "/detalle-credito/:id",
    name: "Detalle Credito",
    icon: "ni ni-bullet-list-67 text-red",
    component: <DetalleCredito />,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/crear-clientes",
    name: "Crear Clientes",
    icon: "ni ni-fat-add text-red",
    component: <CrearClientes />,
    layout: "/admin",
  },
  {
    path: "/editar-cliente/:id",
    name: "Editar Cliente",
    icon: "ni ni ni-fat-add text-red",
    component: <EditarCliente />,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/abonar-cliente/:id/fecha",
    name: " Cliente",
    icon: "ni ni ni-fat-add text-red",
    component: <CuotaCliente />,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/crear-capital",
    name: "Crear capital",
    icon: "ni ni-fat-add text-red",
    component: <CrearCapital />,
    layout: "/admin",
  },
  {
    path: "/crear-gastos",
    name: "Crear gastos",
    icon: "ni ni-fat-add text-info",
    component: <CrearGastos />,
    layout: "/admin",
  },
  {
    path: "/crear-credito/:id",
    name: "Registrar Credito",
    icon: "ni ni-bullet-list-67 text-red",
    component: <CrearCredito />,
    sidebar: false,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/lista-capital",
    name: "Lista capital",
    icon: "ni ni-bullet-list-67 text-red",
    component: <ListaCapital />,
    layout: "/admin",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
    sidebar: false,
  },
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
    sidebar: false,
  },
];
export default routes;
