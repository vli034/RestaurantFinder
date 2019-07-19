import React from 'react';
import axios from 'axios';
// import FormControl from '@material-ui/core/FormControl';

var apiKey ='9399d401d83ef3ae9c95f9c9907d8376';


class MyForm extends React.Component{
    constructor(){
        super();
        this.state={
            userInput:'',
            cuisineArray:[],
            restoArray:[],      //initialized these mfs to empty state 
            isFetching: false   
        }
    }
    handleChange=(event)=>{
        //would i create a conditional statement here to check if the user input === a cuisine name in cusine array?
       
        //take the user input and loop it through the cuisineArray to check if it matches anything in the array 
        // if it matches then  return the cuisine_id
        // pass the cuisine_id as the parameter in fetchRestaurantData() as q: paramater


        this.setState({//re render dom when user access keeebs
            userInput: event.target.value           // target is a method in event that allows us to target the event that occurs  in the input text and we grab the value

        })

        console.log(event.target.value)
        

    }
    async fetchCuisineData(){
        try{
            const cuisineUrl = 'https://cors-anywhere.herokuapp.com/https://developers.zomato.com/api/v2.1/cuisines'
            const types = await axios.get(cuisineUrl,{
                params:{
                    city_id: 3
                },
                headers:{
                    'user-key':apiKey
                }
            })
            this.setState({
                cuisineArray: types.data.cuisines       //array has been populated with cuisine objects that hold cuisnine_id and cuisine_name
            })
            // console.log(types.data.cuisines);

        }catch(error){console.log(error.message)}
    }

    async fetchRestaurantData(){
        try{
            const url = 'https://cors-anywhere.herokuapp.com/https://developers.zomato.com/api/v2.1/search'
            const restaurantOptions = await axios.get(url,{
                params:{
                    q:'pizza'
                },
                headers:{
                    'user-key': apiKey
                }
            })
            this.setState({
                restoArray:restaurantOptions.data.restaurants          //populated array with resto objects -- therefore now we have access to name property 
            })
            console.log(restaurantOptions.data.restaurants);       //restaruant(object).data(object).restaurants(array)-- array of objects that holds different restos for given query


        }catch(error){console.log(error.message)}
    }
    test(){ // cusine array had an array of 'types of cuisine objects'
        const cuisineName = this.state.cuisineArray.map((cus)=>{
            return console.log(cus.cuisine)               /*cus.cuisine populates my array with objects and cus.cuisine.cuisine_name gives me just name*/          //this object was nested as fuck, fuck you zomato API
        })

        return(          
            <section>
                <p>this array has been populated</p>
                {/* <div> {cuisineName}</div> */}
            </section>
        )         
    }

    renderRestaurantOptions(){
        const restaurantName = this.state.restoArray.map((res)=>{
            return res.restaurant.name
        })
        return(
            <section>
                <p>{restaurantName} </p> 
            </section>

        )
    }

   
    componentDidMount(){
        // this.fetchCuisineData();
        this.fetchRestaurantData();
    }
    render(){
        return(
            <main>
                <label>
                    Enter type of cuisine you want to eat:
                    <input type='text' value={this.state.userInput} onChange={this.handleChange}/>
                </label>
                <h2>List of Restaurant Options</h2>
                { this.state.restoArray.length >0 ? this.renderRestaurantOptions():<p>the resto array is empty</p> }
               
                <h2> list of cuisines</h2>
                { this.state.cuisineArray.length >0 ? this.test():<p>the cuisine array is empty</p> }

            </main>
        )
    }
    
}// end class bracket

export default MyForm;