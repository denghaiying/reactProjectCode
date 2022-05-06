import type { ConditionSearch } from "./ConditionCard";
import ConditionCard from "./ConditionCard";

class ConditionStorage {
    readonly STORE_KEY = 'eps-condition-search-items'
    readonly DAK_ID: string
    readonly STORE_NAME: string

    constructor(id: string){
        this.DAK_ID = id;
        this.STORE_NAME = `${this.STORE_KEY}-${window.btoa(this.DAK_ID)}`
    }


    // 获取当前档案库所有查询
    getCardsById (): ConditionCard[]{
        const cards = localStorage.getItem(this.STORE_NAME)
        return cards ? JSON.parse(cards) : []
    }

    getCardByTitle(title: string): ConditionCard {
        const cards = this.getCardsById().filter(item => item.title === title);
        return cards && cards[0]
    }

    // 修改查询数量
    modifyCardNum(data: ConditionCard) {
        if(data){
            data.num += 1
            const cards = this.getCardsById().filter(item => item.title !== data.title);
            cards.unshift(data)
            localStorage.setItem(this.STORE_NAME, JSON.stringify(cards))
            return cards
        }
        return []
    }

    // 移除查询条件
    removeCard(title: string) {
        const cards = this.getCardsById().filter(item => item.title !== title);
        localStorage.setItem(this.STORE_NAME, JSON.stringify(cards))
        return cards
    }

    // 保存查询条件
    addCard(data: ConditionSearch, title='查询条件'){
        const cards = this.getCardsById()
        const card = new ConditionCard(title === '查询条件' ? `查询条件${cards.length + 1}`: title , data)
        cards.push(card)
        localStorage.setItem(this.STORE_NAME, JSON.stringify(cards))
        return cards
    }
}

export default ConditionStorage;
