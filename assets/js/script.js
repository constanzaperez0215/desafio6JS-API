const input =document.getElementById("pesos")
const btn = document.getElementById("btnBuscar")
const resultado = document.getElementById("resultado")
let tipoMoneda = document.getElementById("tipoMoneda")

const urlAPI = "https://mindicador.cl/api"
let myChart = null

btn.addEventListener("click", async () => {
    const pesos = input.value
    const moneda = tipoMoneda.value

    // la funcion valorDeLaMoneda espera a la funcion buscar, ya que va directamente a la api a vuscar la información
    const valorDeLaMoneda = await buscar(moneda)
    console.log(valorDeLaMoneda)

    const valorResultado = (pesos / valorDeLaMoneda).toFixed(2)
    console.log(valorResultado)

    resultado.innerHTML= `${valorResultado}`
})


async function buscar (moneda) {
    try{
        const res = await fetch(`${urlAPI}/${moneda}`)
        const data = await res.json()
        const {serie} = data

        const datos = createDataToChart(serie.slice(0,10).reverse())
console.log(datos)

        if(myChart){
            myChart.destroy()
        }

        renderGrafico(datos)

        const [{valor: valorDeLaMoneda}] = serie
        return valorDeLaMoneda

    } catch(error){
        alert("Ups! Algo salio mal.")
        console.log(error)
    }
}


function createDataToChart(serie) {
    const labels = serie.map(({fecha}) => formatDate(fecha))
        console.log(labels)

    const data = serie.map(({valor})=>valor)
    const datasets =[
        {
         label: "historial ultimos 10 días",
         borderColor: "rgb(255, 99, 132)",
         backgroundColor: "white",
         data,
        }
    ]
    return {labels, datasets}
}

function renderGrafico(data){
    const config = {
        type: "line",
        data,

    }

    const canvas = document.getElementById("myChart").getContext('2d');



    if (myChart){
        myChart.destroy()
    }
    myChart= new Chart (canvas, config)
}

function formatDate(date){
    date = new Date(date)
    const año = date.getFullYear()
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const dia = date.getDate()
    return `${dia}-${mes}-${año}`
}