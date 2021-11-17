import "styles/Home.scss"
import HomeBg1 from "images/chelsea-players.jpg"
import HomeBg2 from "images/chelsea-trophies.png"

function Home() {
  return (
    <div className="bg__container">
      <img
        src={HomeBg1}
        alt="chelsea players"
        className="chelsea-players"
      />
      <img
        src={HomeBg2}
        alt="chelsea trophies"
        className="chelsea-trophies"
      />
    </div>
  )
}

export default Home