import React from 'react';
import '../styles/app.css';
import {fetchAllProperties} from "../services/properties";
import {fetchAllAgents} from "../services/agents";
import {Dropdown} from "../components/dropdown";
import {LoadingSpinner} from "../components/loadingSpinner";
import {
    agentFilter,
    findMedian,
    getAverageNumberOfPropertiesOnMarketByAgency, priceFilterMax, priceFilterMin, renderAgentSelection,
    renderOtherStats,
    renderPriceRange
} from "../components/utils";

const PRICE_RANGE_INTERVAL = 50000;
export class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            priceRangeArray:[],
            agentArray:[],
            selectedAgentIndex:null,
            selectedAgent:null,
            priceMin:null,
            priceMax:null,
            isLoading:true,
            properties:[],
            agents:[],
        }
    }

    componentDidMount() {
        this.initializePropertyList()
    }
    initializePriceRange(properties) {
        const minPrice = Math.round(Math.min(...properties.map(item => item.price)) / 1000) * 1000
        const maxPrice = Math.round(Math.max(...properties.map(item => item.price)) / 1000) * 1000;
        const priceRangeIntervals = (maxPrice - minPrice) / PRICE_RANGE_INTERVAL;
        let priceRangeArr = [{value:'',name:'No selection'}];
        console.log('min max',minPrice,maxPrice,priceRangeIntervals);

        this.setState({priceRangeArray:priceRangeArr})
        for (let i = 0; i < priceRangeIntervals; i++) {
            priceRangeArr.push({
                value: minPrice + (i * PRICE_RANGE_INTERVAL),
                name: minPrice + (i * PRICE_RANGE_INTERVAL)
            })
        }
    }
    initializeAgentSelection(agents){
        let sortedAgents = agents.sort((a,b)=>{
            if (a.agency < b.agency) {
                return -1;
            }
            if (a.agency > b.agency) {
                return 1;
            }
        }).map((agent)=>{return({value:agent.id,name:agent.agency})})
        let agentArray = [{value:'',name:'No selection'},...sortedAgents]
        this.setState({agentArray})

    }
    async initializePropertyList(){
        this.setState({isLoading:true});
        const agents = await fetchAllAgents()
        const properties = await fetchAllProperties()
        this.setState({agents,properties,isLoading:false})
        this.initializePriceRange(properties);
        this.initializeAgentSelection(agents);

        }



    renderProperties(properties){
        return properties.map((property)=>{
            const agentForThisProperty = this.state.agents.find((agent)=>agent.id===property.agent);
            const passesAgentFilter = agentFilter(property,this.state.selectedAgentIndex)
            console.log('this',this.state.priceMin,this.state.priceMax);
            const passesPriceFilterMin = priceFilterMin(property,this.state.priceMin)
            const passesPriceFilterMax = priceFilterMax(property,this.state.priceMax)
            if(passesAgentFilter&&passesPriceFilterMin&&passesPriceFilterMax){
                return (<tr>
                    <td>{property.address}</td>
                    <td>${property.price}</td>
                    <td><div>
                        {property.beds} <i className="material-icons">airline_seat_individual_suite</i>
                        <br />
                        {property.baths}<i className="material-icons">shower</i><br />
                        {property.carPark}<i className="material-icons">directions_car</i>
                    </div></td>
                    <td>{property.areaCode}</td>
                    <td>{agentForThisProperty&&agentForThisProperty.agency}</td>

                </tr>)
            }
            else{
                return null;
            }


        })
    }


    render(){
        const {properties,agents,isLoading}=this.state;
            return (
                <div className="App">
                    <div>
                        {renderPriceRange(this.state.priceMin,this.state.priceMax)}
                        <br />
                        {renderAgentSelection(properties,this.state.selectedAgent,this.state.selectedAgentIndex)}
                        <br />
                        <div style={{whiteSpace:'pre'}}>{renderOtherStats(properties,agents)}</div>
                        <div style={{display:'flex',justifyContent:'center'}}>
                            <Dropdown setValue={(value)=>{
                                console.log('value:agent',value);
                                if(value===''){
                               return this.setState({selectedAgentIndex:null,selectedAgent:null});
                            }else{
                                return this.setState({selectedAgentIndex:value,selectedAgent:this.state.agentArray.find((agent)=>agent.value==value).name})
                            }
                            }} optionsList={this.state.agentArray} placeholder={'Select an agent'} />
                            <div style={{display:'flex',justifyContent:'center'}}>
                                <Dropdown setValue={(value)=>{this.setState({priceMin:value})}} optionsList={this.state.priceRangeArray} placeholder={'Select minimum price'} />
                                <Dropdown setValue={(value)=>{this.setState({priceMax:value})}} optionsList={this.state.priceRangeArray} placeholder={'Select maxmimum price'} />
                            </div>
                        </div>
                        <table style={{marginLeft:20}}>
                            <thead>
                            <th>
                               Address
                            </th>
                            <th>
                               Price
                            </th>
                            <th>
                               Features
                            </th>
                            <th>
                               Area Code
                            </th>
                            <th>
                               Agent
                            </th>
                            </thead>
                            <tbody>
                            {this.renderProperties(properties)}
                            </tbody>
                            {isLoading&&<div style={{display:'flex',justifyContent:'center',width:'100%'}}><LoadingSpinner /></div>}

                        </table>


                    </div>

                </div>
            );
        }
}

export default App;
