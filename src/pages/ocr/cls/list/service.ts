import HttpRequest from "@/eps/commons/v2/HttpRequest";



class OcrPlusService extends HttpRequest {

  save(data: Record<string, unknown>){
    return super.post({
      url: `/ocrplus/cls/build/`,
      data
    })
  }

  findAll(){
    return super.get({
      url: '/ocrplus/cls/'
    })
  }

}

export default new OcrPlusService('/ocrplus')