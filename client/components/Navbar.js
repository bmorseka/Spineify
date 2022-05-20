import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store'

const Navbar = ({ handleClick, isLoggedIn }) => (
	<div id="navbar">
		<h1>Spineify</h1>
		<nav>
			{isLoggedIn && (
				<div>
					<Link to="/home">Home</Link>
					<a href="#" onClick={handleClick}>
						Logout
					</a>
					<Link to="/data">Data</Link>
					<Link to="/favorites">My Stretches</Link>
				</div>
			)}
		</nav>
		<hr />
	</div>
)

/**
 * CONTAINER
 */
const mapState = (state) => {
	return {
		isLoggedIn: !!state.auth.id,
	}
}

const mapDispatch = (dispatch) => {
	return {
		handleClick() {
			dispatch(logout())
		},
	}
}

export default connect(mapState, mapDispatch)(Navbar)
