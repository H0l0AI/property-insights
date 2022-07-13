
export const LoadingSpinner = ()=>{return(<div style={{width:100,height:100}}>
    <div className="loading-container ">
        <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                    <div className="circle" />
                </div>
                <div className="gap-patch">
                    <div className="circle" />
                </div>
                <div className="circle-clipper right">
                    <div className="circle" />
                </div>
            </div>
        </div>
    </div>
</div>)}