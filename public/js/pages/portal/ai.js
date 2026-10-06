// js/pages/portal/ai.js: the model lab as a dashboard section
import { AiLab } from '../../components/ailab.js';
export default{title:'AI model lab',sub:'Compare free Workers AI models on English and Kiswahili questions, then switch the live chat model.',render:()=>{const b=AiLab();b.open=true;b.dispatchEvent(new Event('toggle'));return b}};
