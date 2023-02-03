import puppeteer from 'puppeteer';
import imagens_da_pasta from "./imagens.js"
import * as dotenv from 'dotenv'


(async () => {
    dotenv.config()
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 10,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-dev-shm-usage', '--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'],
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/16.0 Mobile/14E304 Safari/602.1",
        defaultViewport: {
            width: 1365,
            height: 700,
            isMobile: false,
        }
    });
    const page = await browser.newPage();

    let site_url = 'https://m.facebook.com/';
    let titulo = '👨‍💻 Desenvolvimento personalizado para suas necessidades'
    titulo += '\n'
    let texto = "Desenvolvemos soluções de tecnologia sob medida para sua empresa. Com nosso profundo conhecimento em desenvolvimento de sistemas e nossa dedicação ao sucesso do cliente, podemos criar sistemas personalizados que atendam às suas necessidades exclusivas. Entre em contato conosco para saber como podemos ajudar a tornar sua empresa mais eficiente e competitiva"
    texto += '\n'
    texto += '\n'
    texto += "Entre em contato conosco hoje mesmo e descubra como podemos ajudar a impulsionar o sucesso de sua empresa"
    texto += '\n'
    texto += '\n'
    texto += "Site : https://andv.com.br/"
    texto += '\n'
    texto += "WhatsApp : https://api.whatsapp.com/send?phone=5524988667798"

    let qtd_grupos = 0;
    var inicio = new Date();

    try {

        await page.goto(site_url, {
            waitUntil: 'load',
            timeout: 0,
        })

        page.setDefaultNavigationTimeout(0);
        await page.type("#m_login_email", process.env.LOGIN_FACE);
        await page.type("#m_login_password", process.env.SENHA_FACE);

        await page.keyboard.press('Enter');

        await sleep(5);
        const pergunta = await page.$('button._54k8._52jh._56bs._56b_._a2pu._56bw._56bu');
        if (pergunta) {
            await page.click('button[value="Sim"]');
        }

        await sleep(5);

        let groupo_pagina = `https://m.facebook.com/groups_browse/your_groups/`

        await page.goto(groupo_pagina, {
            waitUntil: 'load',
            timeout: 0,
        })

        await sleep(5);

        const verificar_grupo = await page.$$eval('div._2pip > div', divs => divs.length);
        let results = 0;

        if (verificar_grupo > 0) {

            //Rolar a barra para aparecer todos os grupos .. caso tenha acima de 1000 grupos colacar i < 10 ou superior
            for (var i = 0; i < 6; i++) {
                await autoScroll(page);
                console.log({ i: i })
            }

            let x = await page.$$eval('div._7hkf._3qn7._61-3._2fyi._3qng', divs => divs.length)

            console.log(`terminou for com ${x} grupos`)
            await sleep(10);

            results = await page.$$eval('div._7hkf._3qn7._61-3._2fyi._3qng', rows => {
                return Array.from(rows, row => {
                    const columns = row.querySelectorAll('a._7hkg');
                    return Array.from(columns, (column) => {
                        var str = column.href.toString();
                        return str;
                    });

                });
            });
            console.log(results);

            await sleep(10);

            if (results) {
                for (let grupo of results) {

                    if (grupo[0]) {

                        await page.goto(grupo[0], {
                            waitUntil: 'load',
                            timeout: 0,
                        })


                        await sleep(10);

                        const discussao_face = await page.$('[value="Discussão"]');
                        const discussao_face2 = await page.$('div._4g34._6ber._78cq._7cdk._5i2i._52we');

                        if (discussao_face) {
                            await page.click('[value="Discussão"]');

                            await sleep(10);

                            //Verificar Adicionar Imagem
                            const botao_de_upload = await page.$('[title="Adicionar uma foto à publicação"]');
                            await sleep(2);
                            if (botao_de_upload) {
                                const [filechooser] = await Promise.all([
                                    page.waitForFileChooser(),
                                    page.click('[title="Adicionar uma foto à publicação"]'),
                                ]);
                                filechooser.accept(imagens_da_pasta);
                            }

                            //verificar adicionar Texto
                            await sleep(15);

                            const existe_titulo = await page.$('[placeholder="Deseja adicionar um título?"]');

                            let texto_com_titulo = texto;
                            if (existe_titulo) {
                                await page.type('[placeholder="Deseja adicionar um título?"]', titulo);
                            } else {
                                texto_com_titulo = titulo;
                                texto_com_titulo += '\n';
                                texto_com_titulo += texto;
                            }

                            const existe_corpo = await page.$('[aria-label="Escreva algo"]');
                            const existe_corpo2 = await page.$('[aria-label="Crie uma publicação aberta"]');
                            const existe_corpo3 = await page.$('[aria-label="No que você está pensando?"]');


                            if (existe_corpo) {
                                await page.type('[aria-label="Escreva algo"]', texto_com_titulo);
                            } else if (existe_corpo2) {
                                await page.type('[aria-label="Crie uma publicação aberta"]', texto_com_titulo);
                            } else if (existe_corpo3) {
                                await page.type('[aria-label="No que você está pensando?"]', texto_com_titulo);

                            }

                            await sleep(5);
                            await (await page.$('button[value="Publicar"]')).press('Enter');
                            await sleep(5);

                            console.log(`Publicou no grupo -> ${grupo[0]}`)
                            qtd_grupos += 1;
                            await sleep(10);
                        }

                        if (discussao_face2) {

                            await page.click('div._4g34._6ber._78cq._7cdk._5i2i._52we');

                            await sleep(10);

                            //verificar imagem
                            const botao_de_upload = await page.$('[data-sigil="touchable hidden-button photo-button"]');
                            await sleep(2);
                            if (botao_de_upload) {
                                const [filechooser] = await Promise.all([
                                    page.waitForFileChooser(),
                                    page.click('[data-sigil="touchable hidden-button photo-button"]'),
                                ]);
                                filechooser.accept(imagens_da_pasta);
                            }

                            //verificar adicionar Texto
                            await sleep(15);

                            const existe_titulo = await page.$('[placeholder="Deseja adicionar um título?"]');

                            let texto_com_titulo = texto;
                            if (existe_titulo) {
                                await page.type('[placeholder="Deseja adicionar um título?"]', titulo);
                            } else {
                                texto_com_titulo = titulo;
                                texto_com_titulo += '\n';
                                texto_com_titulo += texto;
                            }

                            const existe_corpo = await page.$('[aria-label="Escreva algo"]');
                            const existe_corpo2 = await page.$('[aria-label="Crie uma publicação aberta"]');
                            const existe_corpo3 = await page.$('[aria-label="No que você está pensando?"]');


                            if (existe_corpo) {
                                await page.type('[aria-label="Escreva algo"]', texto_com_titulo);
                            } else if (existe_corpo2) {
                                await page.type('[aria-label="Crie uma publicação aberta"]', texto_com_titulo);
                            } else if (existe_corpo3) {
                                await page.type('[aria-label="No que você está pensando?"]', texto_com_titulo);

                            }
                            await sleep(5);

                            await page.$$eval('button[data-sigil="submit_composer"]', elem => elem[1].click());

                            await sleep(5);

                            console.log(`Publicou no grupo -> ${grupo[0]}`)
                            qtd_grupos += 1;

                            await sleep(10);

                        }
                    }
                }
            }

        }
        await browser.close();
        let resultado_geral = await resultado(inicio, qtd_grupos);
        return resultado_geral;

    } catch (error) {
        await browser.close();
        let resultado_geral = await resultado(inicio, qtd_grupos, error.message);
        return resultado_geral;
    }
})();


async function sleep(sec) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, sec * 1000);
    });
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function resultado(inicio, qtd_grupos, error = null) {
    var fim = new Date();
    var diferenca = new Date(fim - inicio);
    var resultado = diferenca.getUTCHours() + "h ";
    resultado += diferenca.getUTCMinutes() + "m ";
    resultado += diferenca.getUTCSeconds() + "s ";
    console.log({ qtd_grupos, resultado, error })
    return true;
}