//SPA single page aplication
//SSR server side redering
//SSG static side generator

export default function Home(props) {
  
  return (
    <div>
    <h1>index</h1>
    <p>{JSON.stringify(props.episodes)}</p>
 </div>
  )
}

export async function getStaticProps() {
 const response = await fetch('http://localhost:3333/episodes')
 const data = await response.json()
 return {
   props: { //quais dados eu tou puxando da api
     episodes: data,
   },
  //recebe um numero em segundos de qnt tempo eu quero gerar uma nova página ou atualizar a api 
   revalidate: 60 * 60 *8, // a cada 8 horas qnd a pessoa acessa essa página vai gerar uma nova chamada , e api vai ser feita
 }
}
  

