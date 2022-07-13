export const findMedian = (prices)=>{
        const sorted = Array.from(prices).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }
export const getAverageNumberOfPropertiesOnMarketByAgency = (properties,agents)=>{
    //given we have 100 properties and 100 agencies. Surmise we have an average of 1 property per agent.

    //give us the average (mean) properties for each agent
    let agentsAndProperties = agents.map((agent)=>{
        return properties.reduce((accum, property) => {
            if (property.agent===agent.id ) accum+=1; return accum }, 0);
    });
    //sum then divide to find average.
    const sumOfPropertiesPerAgent=agentsAndProperties.reduce((a,b)=>a+b,0);
    return(sumOfPropertiesPerAgent/properties.length)


}

export const renderOtherStats =(properties,agents,selectedAgentIndex)=>{
    let start2020Date = new Date('January 1, 2020 00:00:00');
    let end2020Date = new Date('December 31, 2020 23:59:59');
    let start2019Date = new Date('January 1, 2019 00:00:00');
    let end2019Date = new Date('December 31, 2019 23:59:59');
    let totalValueOfSales2020 = 0;
    let totalValueOfSales2019 = 0;
    let totalAmountOfSaleDays = 0;

    let propertiesFrom2020 = properties.filter((property)=>{
        let listDate = new Date(property.listDate);
        if(listDate>start2020Date&&listDate<end2020Date){
            totalValueOfSales2020+=property.price;
            return true;
        }
    });
    let propertiesFrom2019 = properties.filter((property)=>{
        let listDate = new Date(property.listDate);
        if(listDate>start2019Date&&listDate<end2019Date){
            totalValueOfSales2019+=property.price;
            return true;
        }
    });
    let daysOnTheMarketArray = properties.map((property)=>{
        //divide time difference between the amount of milliseconds in a day and round up.
        let listTimeInDays = Math.ceil((new Date(property.soldDate).getTime()-new Date(property.listDate).getTime())/86400000);
        totalAmountOfSaleDays+=listTimeInDays;
    });
    let averagePrice2020=Math.round(totalValueOfSales2020/propertiesFrom2020.length,2);
    let averagePrice2019=Math.round(totalValueOfSales2019/propertiesFrom2019.length,2);

    let propertiesSoldDuring2020PriceArray = propertiesFrom2020.map((property)=>property.price)
    // 2. Get the median price of properties sold in the year 2020
    let medianPrice = findMedian(propertiesSoldDuring2020PriceArray);
    // 3. Get percentage increase of average property prices in 2020 from 2019
    let percentageIncreaseFrom2019To2020 = ((averagePrice2020-averagePrice2019)/averagePrice2019)*100
    // 4. Get average number of days properties are on market
    let averageNumberOfDaysForSale=totalAmountOfSaleDays/properties.length;
    // 5. Get the average number of properties on market by a particular real estate agency
    let AveragePropertiesPerAgent=getAverageNumberOfPropertiesOnMarketByAgency(properties,agents);


    return `
    Answers to additional tasks:
    ${selectedAgentIndex?'':'1. Santiago Real Estate total value: $688403 (Select any agent to fetch this info)'}
    \n2. Median price sold during 2020: $${medianPrice}
        \n3. Average price increase from 2019 ($${averagePrice2019}) to 2020 ($${averagePrice2020}): ${Math.round(percentageIncreaseFrom2019To2020*100)/100}%
        \n4. Average number of days for sale: ${Math.ceil(averageNumberOfDaysForSale)}
        \n5. Average number of properties per agent: ${AveragePropertiesPerAgent}`



}

export const renderAgentSelection =(properties,selectedAgent,selectedAgentIndex)=>{
    //Get value of properties sold by agent.
    let totalValue = 0;
    properties.map((property)=>{
        const passesAgentFilter = agentFilter(property,selectedAgentIndex);
        if(passesAgentFilter){
            totalValue+=property.price;
        }
    })
    if(selectedAgent) {
        return `Selected Agent: ${selectedAgent}, total value managed $${totalValue}`
    }
    else{
        return 'Showing all Agents.'
    }
}

export const renderPriceRange=(priceMin,priceMax)=>{
    let priceRangeString='';
    if(priceMin&&priceMax){
        priceRangeString =`Showing properties between $${priceMin} and $${priceMax}`
    }
    else if(priceMin){
        priceRangeString = `Showing properties above $${priceMin}.`
    }
    else if(priceMax){
        priceRangeString = `Showing properties below $${priceMax}.`
    }
    else{
        priceRangeString = 'Showing all properties';
    }
    return priceRangeString;
}

export const priceFilterMin=(property,priceMin)=>{
    if(priceMin===null||priceMin=='') {
        return true;
    }
    else{
        if(property.price>priceMin){
            return true;
        }
        else{
            return false;
        }
    }

}
export const priceFilterMax=(property,priceMax)=>{
    if(priceMax===null||priceMax=='') {
        return true;
    }
    else{
        if(property.price<priceMax){
            return true;
        }
        else{
            return false;
        }
    }

}


export const agentFilter=(property,selectedAgent)=>{
    if(selectedAgent===null) {
        return true;
    }
    else{
        if(selectedAgent==property.agent){
            return true;
        }
        else{
            return false;
        }
    }

}