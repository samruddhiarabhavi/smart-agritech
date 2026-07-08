function JobCard(props){
    return(
        <div>
            <h1> Job Card </h1>
            <h3>{props.title}</h3>
            <h4>{props.category}</h4>
            <h4>{props.location}</h4>
            <p>{props.wagePerDay}/day</p>
        </div>
    )

}

export default JobCard;