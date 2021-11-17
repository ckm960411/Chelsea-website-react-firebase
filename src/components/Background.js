import "styles/Background.scss"

function Background() {
  return (
    <div className="bg__container">
      <img
        src="../../images/chelsea-players.jpg"
        alt="chelsea players"
        className="chelsea-players"
      />
      <img
        src="../../images/chelsea-trophies.png"
        alt="chelsea trophies"
        className="chelsea-trophies"
      />
    </div>
  )
}

export default Background