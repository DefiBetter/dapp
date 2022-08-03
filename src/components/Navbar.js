function Navbar(props) {

  return (<div className="navbar">
    <h1>Navbar</h1>
    {props.children && props.children}
  </div>)
}

export default Navbar;