var methods = 
{
	tests:
	{
		amount_tests:0,//общее кол-во вопросов в тестах
		passed:0 //кол-во пройденнх вопросов
	},
	settings:// настройки в разделе чеклист
	[
	{n:"Подготовить документы", checked:false},
	{n:"Выучить польский до уровня A1.", checked:false},
	{n:"Записаться на экзамен.", checked:false},
	{n:"Подготовить тему о себе. ", checked:false}
	],
	theory: 
	{
		amount_theory:0, //общее кол-во тем в темах
		passed:0 //кол-во изученных тем
	},
	tabposition:
	{
		chechlist:null,
		theory:null,
		tests:null,
	},
	init:function() //метод запускающийся при загрузке странице
	{
		Tabs.init();
		this.setSettings(); //считываем данные из localstorage
		//добавляем события ckick 
		for (var i=0; i<document.getElementsByClassName("checkbox").length;i++)
		{
			document.getElementsByClassName("checkbox")[i].addEventListener("click", function(){methods.fillGray();});
			//document.getElementsByClassName("checkbox")[i].setAttribute("onclick", "methods.saveSettings("+i+");return false;");
		}
		
		document.getElementById('menu').children[0].addEventListener( "click" , function(){methods.showMyCheckList(); methods.makeActiveTab(0);},false);
		document.getElementById('menu').children[1].addEventListener( "click" , function(){methods.makeActiveTab(1);methods.showListTheories();},false);
		document.getElementById('menu').children[2].addEventListener( "click" , function(){methods.makeActiveTab(2);methods.showListQuestion();},false);
		this.progressStatus();//запускаем метод отвечающий за полосы пройденных тестов, теории и т. д.
		this.fillGray();//метод выделяющий серым выбранные настройки в чеклист
		this.tabposition.chechlist=document.getElementById('main').innerHTML;
		this.showMyCheckList();
	},
	//метод выделяющий серым выбранные настройки в разделе чеклист
	fillGray:function()
	{
		for (var i=0; i<document.getElementsByClassName("checkbox").length;i++)
		{
			if(document.getElementsByTagName("input")[i].checked)
			{
				document.getElementsByClassName("checkbox")[i].style.color="gray";
			}
			else
				document.getElementsByClassName("checkbox")[i].style.color="black";
			
		}
	},
	//сохранение настроек в checklist
	saveSettings:function(n)
	{
			if (!methods.settings[n].checked)
			{
				methods.settings[n].checked=true;
				localStorage.setItem("settings",JSON.stringify(methods.settings));
				//this.tabposition.chechlist=document.getElementById('main').innerHTML;
			}
			else
			{
				methods.settings[n].checked=false;
				localStorage.setItem("settings",JSON.stringify(methods.settings));
				//this.tabposition.chechlist=document.getElementById('main').innerHTML;	
			}
			
			methods.showListTheories();
			methods.showMyCheckList();
	},
	//метод отрисовки полосы загрузки
	progressStatus:function(tab)
	{
		this.tests.amount_tests=0;
		this.tests.passed=0;
		this.theory.amount_theory=0;
		this.theory.passed=0;
		for (var i=0;i<Tabs.themes.length;i++)
		{
			this.theory.amount_theory += Tabs.themes[i].question.length;
			this.theory.passed += Tabs.themes[i].progress.length;
		}
		for (var i=0;i<Tabs.tests.length;i++)
		{
			this.tests.amount_tests += Tabs.tests[i].question.length;
			for (var j=0;j<Tabs.tests[i].progress.length;j++)
			{
				for (var a=0;a<Tabs.tests[i].answer.length;a++)
				{
					if (Tabs.tests[i].progress[j].q == a)
						if (Tabs.tests[i].progress[j].a == Tabs.tests[i].answer[a].c)
							this.tests.passed++;
				}
			}
		}

				//this.tests.passed += Tabs.tests[i].progress.length;


		document.getElementById('theory').innerText = this.theory.passed + "/" + this.theory.amount_theory;
		document.getElementById('tests').innerText = this.tests.passed + "/" + this.tests.amount_tests;
		if (this.theory.amount_theory == 0)
			document.getElementById('progresstheory').style.width="0%";
		else
			document.getElementById('progresstheory').style.width= (this.theory.passed * 100 / this.theory.amount_theory) + "%";
		
		if (this.tests.amount_tests == 0)
			document.getElementById('progresstests').style.width="0%";
		else
			document.getElementById('progresstests').style.width= (this.tests.passed * 100 / this.tests.amount_tests) + "%";
	},
	
	progressOneTest:function(i)
	{
		var count=0;
			for (var j=0;j<Tabs.tests[i].progress.length;j++)
			{
				for (var a=0;a<Tabs.tests[i].answer.length;a++)
				{
					if (Tabs.tests[i].progress[j].q == a)
						if (Tabs.tests[i].progress[j].a == Tabs.tests[i].answer[a].c)
							count++;
				}
			}
		return count;
	},
	//метод выдеящий активным выбранный таб
	makeActiveTab:function(number)
	{
		for (var i=0;i<document.getElementById('menu').children.length;i++)
		{
			if(i==number)
				document.getElementById('menu').children[i].setAttribute("class", "active");
			else
				document.getElementById('menu').children[i].setAttribute("class", "");
		}
		
	},
	//выводит список тем для выбора
	showListTheories:function()
	{
		var main = document.getElementById('main');
		this.tabposition.theory='<div style="margin-top:5px;width:400px;" class="table-responsive"> <table  class="table table-bordered" style="border:1px solid #f28c08;">';
		for (var i=0;i<Tabs.themes.length; i++)
		{
			var percent =Tabs.themes[i].progress.length * 100 / Tabs.themes[i].question.length
			this.tabposition.theory += '<tr><td ><img src="'+Tabs.themes[i].img+'" alt="..." class="img-rounded"><a onclick="methods.showTheoryQuestions('+i+')" href="#theory">' + (i+1) + ". " + Tabs.themes[i].title + "</a>";
			if (percent == 100)
				this.tabposition.theory +="<br><p style='margin-left:160px;color:red;'>Пройден</p></td></tr>";
			else
			this.tabposition.theory +="<div  style=\"margin-top10px;margin-left:160px;width:200px;\" class=\"progress\"><div id=\"progresstheory\" class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+percent+"%;\"></div></div></td></tr>";
			
		}
		
		this.tabposition.theory += "</table></div>";
		
		main.innerHTML = this.tabposition.theory;
	},
	//метод отрисовки таба чеклист 
	showMyCheckList:function()
	{
		document.getElementById('main').innerHTML=this.tabposition.chechlist;
		this.progressStatus();
		for (var i=0; i<document.getElementsByClassName("chk").length;i++)
		{
			if (methods.settings[i].checked)
				document.getElementsByClassName("chk")[i].setAttribute("checked", "");		
		}
		for (var i=0; i<document.getElementsByClassName("checkbox").length;i++)
		{
			document.getElementsByClassName("checkbox")[i].addEventListener("click", function(){methods.fillGray();});
			document.getElementsByClassName("checkbox")[i].setAttribute("onclick", "methods.saveSettings("+i+");return false;");
		}
		methods.fillGray();
	},
	//метод выводящий тему для изучения и список тем справа
	showTheoryQuestions:function(n, q) //n - номер темы; q - номер вопроса
	{
		
		var html = '<div style="margin-top:5px;width:600px;" class="table-responsive"> <table class="table table-bordered"><tr><td>';
		if (q == undefined)
			q=0;
		
			if (q>=Tabs.themes[n].question.length)
				return;
			var priznak="style=''";
			for (var j=0;j<Tabs.themes[n].progress.length;j++)
				if (q == Tabs.themes[n].progress[j])
					priznak = "checked";
			html +="<b>" + Tabs.themes[n].title+"</b><br><br>"+
			Tabs.themes[n].question[q] + "<br><br>" +
			Tabs.themes[n].answer[q].a + "<br><br>" + 
			'<div class="checkbox"><label><input '+priznak+' id="understand" onclick="methods.actionThemesProgress('+n+","+q+');" type="checkbox">Понятно</label></div>';
		
		html +="<br><br><br><a onclick='methods.showTheoryQuestions("+n+", "+(q ?  q+1 : 1)+");' href='#'>К следующему вопросу.</a><br><a onclick='methods.makeActiveTab(1);methods.showListTheories();' href='#theory'>Вернуться к списку тем</a></div><br></td>";
		if (q==undefined)
			q=0;
		html += "<td style='min-width:270px;'>Список вопросов:<br><br>";
		var priznak="style=''";
		for (var i=0; i<Tabs.themes[n].question.length; i++)
		{
			priznak="style=''";
			for (var j=0;j<Tabs.themes[n].progress.length;j++)
			{
				if (i == Tabs.themes[n].progress[j])
					priznak = "style='color:gray;'";
					
			}
			if (i == q)
				priznak = "style='text-decoration:underline;'";

			html +="<a id='q"+i+"' "+priznak+" onclick='methods.showTheoryQuestions("+n+","+i+")' href='#'>" +(i+1) +". " + Tabs.themes[n].question[i] + "</a><br>";
		}
		html +="</td></tr></table></div>";
		document.getElementById('main').innerHTML = html;
		
	},
	
	actionThemesProgress:function(n, q)// метод добавления и удаления в массив пройденных/отмененых тем по номерам для тем
	{
		var progress = Tabs.themes[n].progress;
		if (document.getElementById('understand').checked)
		{
			if (progress.length == 0)
				progress.push(q);
			else
			{
				for (var i=0;i<progress.length;i++)
				{
					if (progress[i] == q)
						return;
				}
				progress.push(q);
			}
		}
		else
		{
			if (progress.length == 0)
				return;
			for (var i=0;i<progress.length;i++)
				{
					if (progress[i] == q)
						progress.splice(i,1);
				}
			
		}
		
		for (var i=0; i< Tabs.themes.length;i++)
		{
			localStorage.setItem("themes"+i,JSON.stringify(Tabs.themes[i].progress));
		}
		localStorage.setItem("theme", Tabs.themes.length);
	},
	
	//выводит список тестов на выбор
	showListQuestion:function()
	{
		var main = document.getElementById('main');
		var tests='<div style="margin-top:5px;width:400px;" class="table-responsive"> <table class="table table-bordered">';
		for (var i=0;i<Tabs.tests.length; i++)
		{
			//var percent =Tabs.tests[i].progress.length * 100 / Tabs.tests[i].question.length;
			var percent =this.progressOneTest(i) * 100 / Tabs.tests[i].question.length;
			tests += '<tr><td><img src="'+Tabs.tests[i].img+'" alt="..." class="img-rounded"><a onclick="methods.showTestsQuestions('+i+')" href="#tests">' + (i+1) + ". " + Tabs.tests[i].title + "</a>";
			if (percent == 100)
				tests +="<br><p style='margin-left:160px;color:red;'>Пройден</p></td></tr>";
			else
			tests +="<div  style=\"margin-top10px;margin-left:160px;width:200px;\" class=\"progress\"><div id=\"progresstest\" class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+percent+"%;\"></div></div></td></tr>";
			
		}
		
		tests += "</table></div>";
		
		main.innerHTML = tests;
	},
	//включает тест для прохождения
	showTestsQuestions: function(n, q) //n - номер теста q - номер вопроса
	{
		var html = '<div style="margin-top:5px;width:600px;" class="table-responsive"> <table class="table table-bordered"><tr><td>';
		if (q == undefined)
			q=0;
			if (q>=Tabs.tests[n].question.length)
				return;
			var priznak="style=''";
			html +="<b>" + Tabs.tests[n].title+"</b><br><br>"+
			Tabs.tests[n].question[q] + "<br><br><div class=\"radio\">";
			for(var i=0; i<Tabs.tests[n].answer[q].a.length;i++)
			{
				priznak="style=''";
				for (var j=0;j<Tabs.tests[n].progress.length;j++)
				{
						//if (Tabs.tests[n].progress[j].q == q)
						//	priznak="disabled";
						if (Tabs.tests[n].progress[j].a == i && Tabs.tests[n].progress[j].q == q)
							priznak="checked";
						
				}
				html +='<label><input '+priznak+' id="a'+i+'" value="'+i+'" name="question" onclick="methods.actionTestsProgress('+n+","+q+", "+i+');" type="radio">'+Tabs.tests[n].answer[q].a[i]+'<br><br></label><br>';
			}
		
		
		html +="</div><br><br><br><button id='nextq' onclick='methods.showTestsQuestions("+n+", "+(q ?  q+1 : 1)+");' type=\"button\" class=\"btn btn-success\">Ответить</button><br><br><a  onclick='Tabs.tests["+n+"].progress.pop();methods.showTestsQuestions("+n+", "+(q ?  q+1 : 1)+");' href='#tests'>К следующему вопросу.</a><br><a onclick='methods.makeActiveTab(2);methods.showListQuestion();' href='#tests'>Вернуться к списку тестов</a></div><br></td>";
		if (q==undefined)
			q=0;
		html += "<td style='min-width:270px;'>Список вопросов:<br><br>";
		var priznak="style=''";
		for (var i=0; i<Tabs.tests[n].question.length; i++)
		{
			priznak="style=''";
			/*for (var j=0;j<Tabs.tests[n].progress.length;j++)
			{
				if (i == Tabs.tests[n].progress[j].q)
					if(Tabs.tests[n].progress[j].a == Tabs.tests[n].answer[j].c)
					{
						priznak = "style='color:green;'";
						break;
					}
					else
					{
						priznak = "style='color:red;'";

					}
			}*/
			switch (this.checkCorrect(n, i))
			{
				case 1:
				priznak = "style='color:green;'";
				break;
				
				case -1:
				priznak = "style='color:red;'";
				break;
				
				case 0:
				priznak = "style=''";
				break;
				
			}
			
			if (i == q)
				priznak = "style='text-decoration:underline;'";

			html +="<a id='q"+i+"' "+priznak+" onclick='methods.showTestsQuestions("+n+","+i+")' href='#'>" +(i+1) +". " + Tabs.tests[n].question[i] + "</a><br>";
		}
		html +="</td></tr></table></div>";
		document.getElementById('main').innerHTML = html;
	},
	
	checkCorrect:function(i, a)
	{
		var correct =0;
			for (var j=0;j<Tabs.tests[i].progress.length;j++)
			{
					if (Tabs.tests[i].progress[j].q == a)
					{
						if (Tabs.tests[i].progress[j].a == Tabs.tests[i].answer[a].c)
						{
							correct =1;
							break;
						}
						else
						{
							correct = -1;
							break;
						}
					}
					else
						correct = 0;
			}
			return correct;

	},
	//метод добавления пройденных вопросов в переменную progress
	actionTestsProgress:function(n, q, a)
	{
		
		var progress = Tabs.tests[n].progress;
			
			for (var j=0;j<progress.length;j++)
			{
				if (progress[j].q == q)
					progress.splice(j,1);
			}
			
		progress.push({q:q, a:a});
		
		if (Tabs.tests[n].progress.length == Tabs.tests[n].answer.length)
		{
			document.getElementById('nextq').innerText="Ответить и завершить";
			var correct=0;
			/*for (var i=0;i<Tabs.tests[n].progress.length;i++)
			{
				if (Tabs.tests[n].progress[i].a == Tabs.tests[n].answer[i].c)
					correct++;
			}*/
			for (var i=0; i<Tabs.tests[n].question.length; i++)
				{
					if (this.checkCorrect(n, i) == 1)
						correct++;
				}
			document.getElementById('nextq').setAttribute("onclick", "alert('Вы ответили верно на "+correct+" из "+Tabs.tests[n].answer.length+" вопросов'); methods.showListQuestion(); ");
		}
		
		for (var i=0; i< Tabs.tests.length;i++)
		{
			localStorage.setItem("tests"+i,JSON.stringify(Tabs.tests[i].progress));
		}
		
		localStorage.setItem("test", Tabs.tests.length);
	},
	//метод чтения сохраненых настроек из localstorage
	setSettings:function()
	{
		methods.settings=JSON.parse(localStorage.getItem("settings"));
		var test_length = JSON.parse(localStorage.getItem("test"));
		
		for (var i=0;i<test_length;i++)
		{
			Tabs.tests[i].progress = JSON.parse(localStorage.getItem("tests" +i));
		}
		
		var theme_length = JSON.parse(localStorage.getItem("theme"));
		
		for (var i=0;i<theme_length;i++)
		{
			Tabs.themes[i].progress = JSON.parse(localStorage.getItem("themes" +i));
		}
	}
	
}

//объект Tabs  содержащий списки вопросов для тестов и тем
var	Tabs=
	{
		init:function()
		{
			$.getJSON('/json/tests/0.json', function (data) {Tabs.tests[0].question=data;});
			$.getJSON('/json/tests/1.json', function (data) {Tabs.tests[1].question=data;});
		},
	tests:[//массив вопросов
			{
				number:0,//номер вопроса
				title: "Polskie symbole narodowe", //название теста
				progress:[],//массив в корорый добовляются пройденные вопросы
				img:"/img/mini.jpg",//картинка теста
				question:["","","",""],//массив вопросов
				//	"Jak nazywa sie hymn Polski?", "Jak wyglada godlo Polski?", "Kto jest autorem slow Hymnu Narodowego?", "Jak zaczyna sie druga zwrotka hymnu Polskiego?"
				//],
				answer:[//массив ответов
				{q:0, c:1, a:["Bogurodzica", "Mazurek Dabrowskiego", "Marsz, marsz Dabrowski"]},//q - номер вопроса, c - вернный ответ, a - массив содержащий варианты ответов
				{q:1, c:2, a:["Czerwony Orzel na Bialym tle ze zlota korone.", "Zloty Orzel na czerwonym tle.", "Bialy Orzel na czerwonym tle ze zlota korone."]},
				{q:2, c:1, a:["Jan Henryk Dabrowski", "Jozef Wybicki","Adam Mickiewicz"]},
				{q:3, c:0, a:["Przejdziem Wisle, przejdziem Warte...", "Jak Czarniecki do Poznania...", "Jeszcze Polska nie zginela..."]}
				
				]
			},
	
			{
				number:1,
				title:"Pytania z geografii Polski",
				progress:[],
				img:"/img/mini.jpg",
				question:["","","",""],
				//	"Ile wojewodztw ma Polska?", "Jaka jest stolica wojewodztwa mazowieckiego?", "Polska nie graniczy z...", "Jako miasto lezy nad morzem:"
				//],
				answer:[
				{q:0,c:2, a:["18", "12", "16"]},
				{q:1,c:0, a:["Warszawa","Bialystok","Bydgoszcz"]},
				{q:2,c:1, a:["Rosja","Slowenia", "Litwa"]},
				{q:3,c:0, a:["Kolobrzeg", "Poznan"]},
				]
				
			}
		
		
		],
		
		themes:[ //массив тем
			{
				number:0,//номер
				title:"Polskie symbole narodowe",//название
				progress:[],
				img:"/img/mini.jpg",
				question:[//вопросы
				"Jak wyglada godlo Polski?",//0
				"Jak wyglada flaga Polski?",//1
				"Historia hymnu polskiego?",//2
				"Tekst  hymnu polskiego?",//3
				"Jaki Hymn byl w sredniowieczu?" //4

				
				
				],
				answer:[
				{q:0, a:"Bialy Orzel na czerwonym tle ze zlota korone."},
				{q:1, a:"Bialy na gorze, czerwony na dole."},
				{q:2, a:"Mazurek Dabrowskiego Ц polska piesn patriotyczna.<br>Od 1927 roku oficjalny Hymn panstwowy Rzeczpospolitej Polski<br>Zostal napisany przez Jozefa Wybickiego w 1797r. Pierwotnie byl Piesnia Legionow Polskich we Wloszech"},
				{q:3, a:"Jeszcze Polska nie zginela,<br>Kiedy my zyjemy.<br>Co nam obca przemoc wziela,<br>Szabla odbierzemy.<br><br>" +
				"Marsz, marsz Dabrowski,<br>Z ziemi wloskiej do Polski.<br>Za twoim przewodem<br>Zlaczym sie z narodem.<br><br>" +
				"Przejdziem Wisle, przejdziem Warte,<br>Bedziem Polakami.<br>Dal nam przyklad Bonaparte,<br>Jak zwyciezac mamy.<br>Marsz, marsz...<br><br>"+
				"Jak Czarniecki do Poznania<br>Po szwedzkim zaborze,<br>Dla ojczyzny ratowania<br>Wrocim sie przez morze.<br><br>"+
				"Marsz, marsz...<br><br>"+
				"Juz tam ojciec do swej Basi<br>Mowi zaplakany -<br>Sluchaj jeno, pono nasi<br>Bija w tarabany.<br><br>"+
				"Marsz, marsz.."},
				{q:4, a:"W sredniowieczu role hymnu pelnila piesn Bogurodzica."}
				]
			},
			
			{
				number:1,
				title:"Pytania z geografii Polski",
				progress:[],
				img:"/img/mini.jpg",
				question:[
				"Podzial administracyjny?",//0
				"Nazwa wojewodztwa Polski i ich stolice?",//1
				"Z jakimi panstwami graniczy RP?",//2
				"Czy Polska lezy nad morzem?",//3
				"Polskie miasta polozone nad Baltykiem?"//4
				],
				answer:[
				{q:0, a:"Administracyjnie Polska podzielona jest na 16 wojewodow, wojewodztwa dziela sie na 314 powiatow."},
				{q:1, a:"dolnoslaskie - Wroclaw<br>"+
				"kujawsko-pomorskie - Bydgoszcz (siedziba wojewody) i Torun (siedziba sejmiku wojewodzkiego)<br>"+
				"lubelskie - Lublin<br>"+
				"lubuskie - Gorzow Wielkopolski (siedziba wojewody) i Zielona Gora (siedziba sejmiku wojewodzkiego)<br>"+
				"lodzkie - Lodz<br>"+
				"malopolskie - Krakow<br>"+
				"mazowieckie - Warszawa<br>"+
				"opolskie - Opole<br>"+
				"podkarpackie - Rzeszow<br>"+
				"podlaskie - Bialystok<br>"+
				"pomorskie - Gdansk<br>"+
				"slaskie - Katowice<br>"+
				"swietokrzyskie - Kielce<br>"+
				"warminsko-mazurskie - Olsztyn<br>"+
				"wielkopolskie - Poznan<br>"+
				"zachodniopomorskie Ц Szczecin<br>"},
				{q:2, a:"Z Niemcami na zachodzie,<br>"+
				"z Czechami i Slowacja na poludniu, <br>"+
				"z Ukraina i Bialorusia na wschodzie,<br>"+
				"z Litwa i Federacja Rosyjska (Okreg Kaliningradzki) na polnocy."},
				{q:3, a:"Tak, na polnocy nad morzem Baltyckim."},
				{q:4, a:"Trojmiasto - Gdansk, Gdynia, Sopot. W srodkowej czesci miasto Kolobrzeg. W zachodniej - Swinoujscie."}
				]
			}
		]
	}



