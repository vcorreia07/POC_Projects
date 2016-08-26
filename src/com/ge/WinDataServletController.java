package com.ge;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@SuppressWarnings("serial")
@WebServlet("/WinDataController")
public class WinDataServletController extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("in WinDataServletController");
		URL url=null;
		String strJson = null;
		try{
		 url = new URL("https://adgas-winddata-timeseries-service.run.aws-usw02-pr.ice.predix.io/services/windservices/tags"); 
		 URLConnection urlCon = url.openConnection(); 
			String inputLine = ""; 
			BufferedReader buff = new BufferedReader(new InputStreamReader( 
					urlCon.getInputStream())); 
			
			while ((inputLine = buff.readLine()) != null) { 
				strJson = inputLine; 
			} 
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		/*Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress( 
		"3.234.164.81", 80)); 
		URLConnection urlCon = url.openConnection(proxy);*/ 
		
		
		response.setContentType("text/html;charset=UTF-8");
		//response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(strJson);
		
		
	}





}
