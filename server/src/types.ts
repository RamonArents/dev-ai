//Source types
export interface IRefAttributes {
  title: string;
  snippet:string;
  link: string;
}

//Ai types
export interface IAiAttributes {
  type:string;
  snippet:string;  
}

//Attributes of above type are in organic_results. Therefore we use this interface
export interface ISerpApiResponse {
  references?:IRefAttributes[];
  text_blocks?: IAiAttributes[];
}