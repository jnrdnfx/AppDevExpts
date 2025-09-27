
function sumtotal(){
    let nums=[10,5,2,8,4];
    let sum=0;
    for(let i=0;i<nums.length;i++)
    {
        
        sum= sum + nums[i];
    }
    console.log(sum);
}
function smallest_num(){
    let nums=[10,5,2,8,4];
    let smallest=nums[0];
    for(let i=1;i<nums.length;i++)
    {
        if(nums[i]<smallest)
        {
            smallest=nums[i];
        }
    }
    console.log(smallest);
}
sumtotal();
smallest_num();
