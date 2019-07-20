import React from 'react';
import axios from 'axios';
// import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

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
        const onlyCuisineWeCareAbout = this.state.cuisineArray.filter((cuisine) => {         //grab the current state of user input -- that we get from handle change.
            return cuisine.cuisine_name === this.state.userInput                            //Filtered through the cuisine array that holds objects with only cuisine ID and name and return the cuisine name that matches the string inputted from user
        })
    //    console.log(onlyCuisineWeCareAbout)                                               //Then CuisneWecareAbout returns an array(filter returns array) with ONE object from cuisineArray that matches user input 

        this.fetchRestaurantData(onlyCuisineWeCareAbout[0].cuisine_id);                     //Called the second api to access the first and only element in that array, which is an object and the property we wa t
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
                <div key={res.restaurant.id}>
                    <h2>{res.restaurant.name}</h2>
                    <p>Average cost for 2 persons: ${res.restaurant.average_cost_for_two}</p>
                    <img alt='' src={res.restaurant.featured_image}/>
     
                </div>
            )          
        })
        return(
            <div>
                <div>{restaurantName} </div>   
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
                <label>
                    Enter type of cuisine you want to eat:
                    <input type='text' value={this.state.userInput} onChange={this.handleChange}/>
                    <Button variant='contained' color='primary' onClick={()=>this.handleOnSubmit()}>submit</Button>
                </label>
                <h2>List of Restaurant Options</h2>
                { this.state.restoArray.length >0 ? this.renderRestaurantOptions():<p>the resto array is empty</p> }
               
                {/* <h2> list of cuisines</h2> */}
                {/* { this.state.cuisineArray.length >0 ? this.renderCuisine():<p>the cuisine array is empty</p> } */}
                {/* {this.handleOnSubmit()} */}
                {/* {this.renderRestaurantOptions()} */}

            </main>
        )
    }
    
}// end class bracket

export default MyForm;