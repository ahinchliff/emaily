import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="left brand-logo">Emaily</a>
          <ul className="right">
            <li><a>Login With Google</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}
function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Header);


