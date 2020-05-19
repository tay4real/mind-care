import React, {Component} from 'react'
import {register} from '../Users/UserFunctions'
import Link from '@material-ui/core/Link';

class Register extends Component{
    constructor(){
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email : '',
            password : '',
            re_password:''
            
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e){
        e.preventDefault()

        const newUser = {
            name : this.state.first_name + ' ' + this.state.last_name,
            email : this.state.email,
            password : this.state.password,
            re_password: this.state.re_password
        }

        register(newUser).then(res => {
            if(res){
                this.props.history.push(`/login`)
            }
        })
    }

    render(){
        return(
            
            <div className="container" style={{padding: "128px 16px"}}>
                <div className="row card" >
                    <div className="col-md-6 mt-5 mb-5 mx-auto">
                        <div className="card-header bg-transparent border-primary">
                            <h1 className="h3  text-center font-weight-normal">
                                Register
                            </h1>
                        </div>
                        
                        <form noValidate onSubmit = {this.onSubmit}>
                            
                            <div className="card-body">
                            <div class="row">
                                <div class="col">
                                    <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <input
                                    type="text" 
                                    className = "form-control"
                                    name = "first_name"
                                    placeholder = "Enter First Name"
                                    value = {this.state.first_name}
                                    onChange = {this.onChange}
                                    />
                                </div>
                                </div>
                                    <div class="col">
                                        <div className="form-group">
                                        <label htmlFor="last_name">Last Name</label>
                                        <input
                                        type="text" 
                                        className = "form-control"
                                        name = "last_name"
                                        placeholder = "Enter Last Name"
                                        value = {this.state.last_name}
                                        onChange = {this.onChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                type="email" 
                                className = "form-control"
                                name = "email"
                                placeholder = "Enter Email"
                                value = {this.state.email}
                                onChange = {this.onChange}
                                />
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                        type="password" 
                                        className = "form-control"
                                        name = "password"
                                        placeholder = "Enter Password"
                                        value = {this.state.password}
                                        onChange = {this.onChange}
                                        />
                                    </div>
                                </div>
                                <div class="col">
                                    <div className="form-group">
                                        <label htmlFor="re_password">Confirm Password</label>
                                        <input
                                        type="password" 
                                        className = "form-control"
                                        name = "re_password"
                                        placeholder = "Re-Enter Password"
                                        value = {this.state.re_password}
                                        onChange = {this.onChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="card-footer bg-transparent border-primary">
                                <button type="submit" className="btn btn-lg btn-primary btn-block">Register</button>
                                <div className="col-sm text-center pt-2" >
                                    <Link href="/signin" variant="body1">
                                        Already have an account? Sign in
                                    </Link>
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register