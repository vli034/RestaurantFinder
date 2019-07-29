import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/FormControl';


var apiKey ='9399d401d83ef3ae9c95f9c9907d8376';


class MyForm extends React.Component{
    constructor(){
        super();
        this.state={                                           //initialized these mfs to empty state 
            userInput:'',
            cuisineArray:[],
            restoArray:[],      
        }
    }
    handleChange=(event)=>{                                  // Has to retreive the user input value that we get in our handleChange method. This gets the string value of whatever the user has inputted 
       this.setState({                                       //re render dom when user access keeebs
            userInput: event.target.value        
        })
    }

    // This is a function that gets called when the user clicks submit
    handleOnSubmit() {
        //had to modify user input to match JSON file name/case sensitivity & structure
        let modifiedUserInput = this.state.userInput.charAt(0).toUpperCase()+this.state.userInput.slice(1);
  
        const onlyCuisineWeCareAbout = this.state.cuisineArray.filter((cuisine) => {         //grab the current state of user input -- that we get from handle change.
            return cuisine.cuisine_name === modifiedUserInput                          //Filtered through the cuisine array that holds objects with only cuisine ID and name and return the cuisine name that matches the string inputted from user
        })

        //some error checking
        if(onlyCuisineWeCareAbout && onlyCuisineWeCareAbout[0] === undefined){
            alert(`Sorry we could not find ${this.state.userInput}. Please enter another cuisine type `);
        } else{ 
            this.fetchRestaurantData(onlyCuisineWeCareAbout[0].cuisine_id);                     //Then CuisneWecareAbout returns an array(filter returns array) with ONE object from cuisineArray that matches user input 
        }                                                                                       //Called the second api to access the first and only element in that array, which is an object and the property we wa t
                                                                                                // PASS IT the cuisine_id value that we are able to get from the  object attributes-- cuisine_id                                                                                                                                                                  
        
        //OnClick - clear user input field 
        this.setState({userInput: ''})
    }

    //Retrieve cuisine data via zomato api
    async fetchCuisineData(){
        try{
            const cuisineUrl = 'https://cors-anywhere.herokuapp.com/https://developers.zomato.com/api/v2.1/cuisines'
            const types = await axios.get(cuisineUrl,{
                params:{
                    city_id: 7
                },
                headers:{
                    'user-key':apiKey
                }
            })
            
            const cus_arr = types.data.cuisines //grab our formatted array from our API in types and hold that array in a constant 
            const cuisineName = cus_arr.map((cus)=>{ // map it out
                return cus.cuisine
            })

            this.setState({
                cuisineArray: cuisineName    //setting the state of initialized array witth cus_arr that is one level deeper giving us cuisine_name/ & id
            })

            // console.log(test)
            // console.log(this.state.cuisineArray);

        }catch(error){console.log(error.message)}
    }

    //retrieve all the restaruants with associating cuisine 
    async fetchRestaurantData(cuisineId){ // takes a parameter bc this api endpoint needd a query param --set a parama called cuisineId
        try{
            const url = 'https://cors-anywhere.herokuapp.com/https://developers.zomato.com/api/v2.1/search'
            const restaurantOptions = await axios.get(url,{
                params:{
                    cuisines: cuisineId
                },
                headers:{
                    'user-key': apiKey
                }
            })
            this.setState({
                restoArray:restaurantOptions.data.restaurants          // populat the  empty array with resto objects that match the cuisine from user input (search end point knows which resto with goes with which cuisine via the cuisine id )
            })
           // console.log(restaurantOptions.data.restaurants);       //restaruant(object).data(object).restaurants(array)-- array of objects that holds different restos for given query
            console.log(this.state.restoArray)

            /*const test =this.state.restoArray.map((res)=>{               //by inserting a fixed query value, const restaurOtions give us an array of options that match the cuisine vakue and 
                return console.log(res.restaurant.name);                 //by making over all the objects we retrieve a name  
            })*/
        }catch(error){console.log(error.message)}
    }

    // this function is called and render always checking if the array has been filled 
    renderRestaurantOptions(){
        const restaurantName = this.state.restoArray.map((res)=>{    //must return jsx to show on second return      
            return (
                <section>
                    <div className='restoCard' key={res.restaurant.id}>
                        <img alt='' src={res.restaurant.featured_image}/>
                        <h2 className='restoName'>{res.restaurant.name}</h2>
                        <p>Average cost for 2 persons: ${res.restaurant.average_cost_for_two}</p>
                    </div>
                </section>
            )          
        })
        return(
            <div>
                <h1 className='listHeader'>List of Restaurants</h1>
                <div className='restoList'>{restaurantName} </div>   
            </div>

        )
    }

   

   //Calling our functions that retrieve API data 
    componentDidMount(){
        this.fetchCuisineData();
    }
    render(){
        return(
            <main>
                <div className='mainWrap'>
                    <div className='wrapper'>
                    <FormControl className='formControl'>
                        <TextField  variant="outlined" type='text' 
                        label="enter type of cuisine" 
                        value={this.state.userInput} 
                        onChange={this.handleChange}/> 
                         <InputLabel 
                         style={{marginTop:3+'px',
                         marginLeft:2+'px', 
                         fontStyle:'italic', 
                         color:'#3b3b39'}}>What kind of food are we craving today?</InputLabel>
                    </FormControl>
                    </div>
                    <Button  
                    variant='contained' color='primary' 
                    style={{marginTop:14+'px', width:10+'%',marginBottom:2.4+'%',
                    marginLeft:5+'px',
                    fontSize:15}}
                    onClick={()=>this.handleOnSubmit()}>submit</Button>
                </div>
                { this.state.restoArray.length >0 ? this.renderRestaurantOptions():<img  className='gif-image' src={require("../assets/ryanGosling.gif")} alt="rachel mcadams cant fucking decide" /> }

            </main>
        )
    }
    
}// end class bracket

export default MyForm;